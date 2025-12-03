import express from 'express';
import Albergue from '../models/Albergue.js';
import Postulacion from '../models/Postulacion.js'; 

const router = express.Router();

// 1. INICIALIZAR (SEED UNIFORME - 100 CUPOS)
router.post('/seed', async (req, res) => {
  try {
    // 1. Borramos los albergues viejos (los que tienen capacidad 0)
    await Albergue.deleteMany({}); 
    
    // 2. ¡NUEVO! Borramos las postulaciones antiguas
    // Esto elimina los "fantasmas" que te causan el número negativo
    await Postulacion.deleteMany({}); 

    const alberguesIniciales = [
      // TODOS CON 100 CUPOS
      { nombre: "Gimnasio Polideportivo", ubicacion: "Viña del Mar", actividad: "Remoción de Escombros", capacidadMaxima: 100 },
      { nombre: "Cancha El Tranque", ubicacion: "Viña del Mar", actividad: "Remoción de Escombros", capacidadMaxima: 100 },
      { nombre: "Cerro La Cruz - Zona Cero", ubicacion: "Valparaíso", actividad: "Remoción de Escombros", capacidadMaxima: 100 },

      { nombre: "Liceo Eduardo de la Barra", ubicacion: "Valparaíso", actividad: "Acopio y Logística", capacidadMaxima: 100 },
      { nombre: "Bodega Puerto Central", ubicacion: "San Antonio", actividad: "Acopio y Logística", capacidadMaxima: 100 },
      { nombre: "Terminal de Buses", ubicacion: "Quilpué", actividad: "Acopio y Logística", capacidadMaxima: 100 },

      { nombre: "Escuela Industrial", ubicacion: "San Antonio", actividad: "Primeros Auxilios", capacidadMaxima: 100 },
      { nombre: "Carpa Plaza Victoria", ubicacion: "Valparaíso", actividad: "Primeros Auxilios", capacidadMaxima: 100 },
      { nombre: "Sede Cruz Roja", ubicacion: "Viña del Mar", actividad: "Primeros Auxilios", capacidadMaxima: 100 },

      { nombre: "Colegio Aconcagua", ubicacion: "Quilpué", actividad: "Cocina Solidaria", capacidadMaxima: 100 },
      { nombre: "Junta de Vecinos #45", ubicacion: "Villa Alemana", actividad: "Cocina Solidaria", capacidadMaxima: 100 },
      { nombre: "Parroquia San Expedito", ubicacion: "Reñaca", actividad: "Cocina Solidaria", capacidadMaxima: 100 },
    ];

    await Albergue.insertMany(alberguesIniciales);
    res.json({ msg: '✅ BASE DE DATOS REINICIADA: Todo limpio y con 100 cupos.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OBTENER ESTADO DE CUPOS
router.get('/estado', async (req, res) => {
    try {
      const albergues = await Albergue.find();
      
      const estadoReal = await Promise.all(albergues.map(async (lugar) => {
          // Contamos ocupados (confirmados o en revisión)
          const ocupados = await Postulacion.countDocuments({ 
              $or: [
                  { albergueAsignado: lugar._id, estado: { $in: ['en_revision_albergue', 'confirmada'] } }
              ]
          });
          
          // Cálculo seguro (nunca negativo)
          const disponibles = Math.max(0, lugar.capacidadMaxima - ocupados);

          return {
              ...lugar._doc,
              ocupados: ocupados,
              disponibles: disponibles
          };
      }));
  
      res.json(estadoReal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  export default router;