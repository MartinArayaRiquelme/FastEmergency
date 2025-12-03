import mongoose from 'mongoose';

const postulacionSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  actividad: { type: String, required: true },
  
  // --- GESTIÓN DE ALBERGUES ---
  alberguePreferido: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Albergue', 
    required: true 
  },
  albergueAsignado: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Albergue', 
    default: null
  },
  
  // --- DATOS DEL TURNO ---
  fecha: { type: String, required: true },
  horario: { type: String, required: true },

  // --- NUEVO: DOCUMENTOS ADJUNTOS ---
  // Guardaremos un arreglo de strings (las rutas/nombres de los archivos)
  documentos: [{ type: String }], 

  // --- NUEVO: ESTADOS DEL FLUJO ---
  estado: { 
    type: String, 
    default: 'pendiente', 
    enum: [
        'pendiente',            // El voluntario la envió, nadie la ha visto
        'en_revision_albergue', // El Coordinador la aprobó, ahora le toca al Encargado
        'confirmada',           // El Encargado dio el visto bueno final (¡Éxito!)
        'rechazada',            // Rechazada en cualquier etapa
        'observada'             // Caso especial si faltan papeles
    ] 
  },

  fechaCreacion: { type: Date, default: Date.now }
});

const Postulacion = mongoose.model('Postulacion', postulacionSchema);
export default Postulacion;