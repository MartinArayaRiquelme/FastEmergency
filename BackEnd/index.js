import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno
import express from 'express';

import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- IMPORTACIÓN DE RUTAS ---
// Nota: En modo "Module", a veces es obligatorio poner la extensión .js al final
import usuarioRoutes from './routes/usuarioRoutes.js';
import albergueRoutes from './routes/albergueRoutes.js';
import postulacionRoutes from './routes/postulacionRoutes.js';
// --- CONFIGURACIÓN DE __DIRNAME (No existe nativamente en Modules) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
// --- 📂 CARPETA PÚBLICA DE FOTOS ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- CONEXIÓN A MONGODB ---
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fastEmergencyDB';

mongoose.connect(mongoUri)
    .then(() => console.log('✅ Conectado exitosamente a MongoDB'))
    .catch((err) => console.error('❌ Error fatal conectando a MongoDB:', err));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/albergues', albergueRoutes);
app.use('/api/postulaciones', postulacionRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
    console.log(`📂 Carpeta de fotos pública en: http://localhost:${PORT}/uploads`);
});