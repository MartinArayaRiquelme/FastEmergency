import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Postulacion from '../models/Postulacion.js';
import Albergue from '../models/Albergue.js';
import { enviarNotificacion } from '../utils/mailer.js';

const router = express.Router();

// --- CONFIGURACIÓN MULTER ---
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });
// ----------------------------

// 1. GUARDAR POSTULACIÓN
router.post('/', upload.array('archivos'), async (req, res) => {
  try {
    const turnos = JSON.parse(req.body.turnos); 
    const usuarioId = req.body.usuarioId;
    const rutasArchivos = req.files ? req.files.map(file => file.filename) : [];

    const promesas = turnos.map(turno => {
      return new Postulacion({
        usuarioId,
        actividad: turno.actividad,
        fecha: turno.fecha,
        horario: turno.horario,
        alberguePreferido: turno.alberguePreferido,
        documentos: rutasArchivos
      }).save();
    });

    await Promise.all(promesas);
    res.status(201).json({ msg: 'Solicitud enviada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar' });
  }
});

// 2. OBTENER HISTORIAL (Voluntario)
router.get('/:usuarioId', async (req, res) => {
  try {
    const postulaciones = await Postulacion.find({ usuarioId: req.params.usuarioId })
      .populate('albergueAsignado', 'nombre ubicacion')
      .sort({ fechaCreacion: -1 });
    res.json(postulaciones);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

// 3. (COORDINADOR - SUPERVISOR GENERAL) 
// Esta ruta YA ES UNIVERSAL. Trae TODO lo 'pendiente' sin importar el lugar.
router.get('/admin/pendientes', async (req, res) => {
    try {
      const pendientes = await Postulacion.find({ estado: 'pendiente' })
        .populate('usuarioId', 'nombre email')
        .populate('alberguePreferido', 'nombre ubicacion')
        .sort({ fechaCreacion: 1 });
      res.json(pendientes);
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

// 4. (COORDINADOR) DERIVAR A ALBERGUE ESPECÍFICO
router.put('/:id', async (req, res) => {
  try {
    const { estado, albergueAsignadoId } = req.body; 
    const { id } = req.params; 

    // Validación de cupos
    if (estado === 'aprobado') {
        if (!albergueAsignadoId) return res.status(400).json({ msg: "Falta destino." });
        
        const albergueDestino = await Albergue.findById(albergueAsignadoId);
        if (!albergueDestino) return res.status(404).json({ msg: "Albergue no existe." });

        const ocupados = await Postulacion.countDocuments({ 
            albergueAsignado: albergueAsignadoId, 
            estado: 'confirmada' 
        });

        if (ocupados >= albergueDestino.capacidadMaxima) {
            return res.status(400).json({ msg: `⛔ ${albergueDestino.nombre} LLENO.` });
        }
    }

    const estadoReal = estado === 'aprobado' ? 'en_revision_albergue' : 'rechazada';
    const updateData = { estado: estadoReal };
    if (albergueAsignadoId) updateData.albergueAsignado = albergueAsignadoId;

    const postulacion = await Postulacion.findByIdAndUpdate(id, updateData, { new: true })
        .populate('usuarioId', 'nombre email')
        .populate('albergueAsignado', 'nombre');

    if (estadoReal === 'rechazada') {
        enviarNotificacion(postulacion.usuarioId.email, postulacion.usuarioId.nombre, 'rechazado', "General", postulacion.fecha, postulacion.horario);
    }

    res.json(postulacion);
  } catch (error) { res.status(500).json({ error: 'Error' }); }
});

// 5. (ENCARGADO DE ALBERGUE - RESTRINGIDO)
// Aquí volvemos a filtrar por :idAlbergue. Romina solo ve SU albergue.
router.get('/albergue/:idAlbergue', async (req, res) => {
    try {
        const asignadas = await Postulacion.find({ 
            albergueAsignado: req.params.idAlbergue, // <--- EL FILTRO CLAVE
            estado: 'en_revision_albergue' 
        })
        .populate('usuarioId', 'nombre email')
        .sort({ fechaCreacion: 1 });

        res.json(asignadas);
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

// 6. (ENCARGADO) CONFIRMACIÓN FINAL
router.put('/confirmacion-final/:id', async (req, res) => {
    try {
        const { accion } = req.body; 
        const nuevoEstado = accion === 'confirmar' ? 'confirmada' : 'rechazada';

        const postulacion = await Postulacion.findByIdAndUpdate(
            req.params.id, 
            { estado: nuevoEstado }, 
            { new: true }
        ).populate('usuarioId').populate('albergueAsignado');

        // Notificación final al voluntario
        enviarNotificacion(
            postulacion.usuarioId.email,
            postulacion.usuarioId.nombre,
            nuevoEstado === 'confirmada' ? 'aprobado' : 'rechazado',
            postulacion.albergueAsignado.nombre,
            postulacion.fecha,
            postulacion.horario
        );

        res.json(postulacion);
    } catch (error) { res.status(500).json({ error: 'Error' }); }
});

export default router;