import usuarioRoutes from './routes/usuarioRoutes.js';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import postulacionRoutes from './routes/postulacionRoutes.js';
import albergueRoutes from './routes/albergueRoutes.js'

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- ZONA DE PRUEBAS ---
console.log('--- INTENTANDO CONECTAR ---');
console.log('1. Leyendo archivo .env...');
console.log('2. La URI es:', process.env.MONGO_URI); // ¿Esto imprime la dirección o undefined?

const connectDB = async () => {
  try {
    // Forzamos que use IPv4 (127.0.0.1) por si tu PC prefiere IPv6
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4 
    });
    console.log('✅ ¡EXITO! Conectado a la Base de Datos');
  } catch (error) {
    console.error('❌ ERROR FATAL:', error.message);
  }
};

connectDB();
// -----------------------

app.get('/', (req, res) => {
  res.send('API Funcionando');
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/albergues', albergueRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});