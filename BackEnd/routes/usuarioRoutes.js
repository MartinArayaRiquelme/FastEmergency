import express from 'express';
import Usuario from '../models/Usuario.js';
import Albergue from '../models/Albergue.js'; // <--- IMPORTANTE: Importamos Albergue

const router = express.Router();

// ==========================================
// 1. SEED DE USUARIOS (CREACIÓN AUTOMÁTICA)
// POST http://localhost:3000/api/usuarios/seed
// ==========================================
router.post('/seed', async (req, res) => {
  try {
    // A. Limpiamos la tabla de usuarios para no duplicar
    await Usuario.deleteMany({});

    // B. Buscamos un albergue real para asignarle a la encargada
    // (Trae el primero que encuentre en la BD)
    const unAlbergue = await Albergue.findOne(); 

    // C. Definimos los usuarios base
    const usuariosIniciales = [
      {
        nombre: "Jefe Coordinador",
        email: "coordinador@gmail.com",
        password: "123",
        rol: "coordinador"
      },
      {
        nombre: "Juan Voluntario",
        email: "voluntario@gmail.com",
        password: "123",
        rol: "usuario"
      }
    ];

    // D. Solo creamos a la Encargada si existen albergues creados
    if (unAlbergue) {
        usuariosIniciales.push({
            nombre: "Romina Encargada",
            email: "encargado@gmail.com",
            password: "123",
            rol: "encargado_albergue",
            albergueId: unAlbergue._id // <--- ¡AQUÍ ESTÁ LA MAGIA! Se conecta solo.
        });
    }

    // E. Guardamos todo en la Base de Datos
    await Usuario.insertMany(usuariosIniciales);
    
    res.json({ 
        msg: '✅ Usuarios creados con éxito (Pass: 123)',
        usuarios: [
            'coordinador@gmail.com (Jefe)',
            'encargado@gmail.com (Terreno)',
            'voluntario@gmail.com (Usuario)'
        ],
        albergueAsignadoAEncargado: unAlbergue ? unAlbergue.nombre : "⚠️ Ninguno (Primero corre el seed de albergues)"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// 2. REGISTRO DE USUARIO NUEVO
// POST http://localhost:3000/api/usuarios
// ==========================================
router.post('/', async (req, res) => {
  try {
    const datosUsuario = req.body;

    // Validación de seguridad: Solo Gmail
    if (!datosUsuario.email.endsWith('@gmail.com')) {
        return res.status(400).json({ msg: 'Solo se permiten correos @gmail.com' });
    }

    // Verificar si ya existe
    const existe = await Usuario.findOne({ email: datosUsuario.email });
    if (existe) {
        return res.status(400).json({ msg: 'Ese correo ya está registrado' });
    }

    const nuevoUsuario = new Usuario(datosUsuario);
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json(usuarioGuardado);

  } catch (error) {
    res.status(400).json({ msg: 'Error al registrar usuario', error: error.message });
  }
});


// ==========================================
// 3. INICIO DE SESIÓN (LOGIN)
// POST http://localhost:3000/api/usuarios/login
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar si el correo existe
    const usuarioEncontrado = await Usuario.findOne({ email });
    if (!usuarioEncontrado) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar contraseña (Simple)
    if (usuarioEncontrado.password !== password) {
      return res.status(400).json({ msg: 'Contraseña incorrecta' });
    }

    // Convertir a objeto simple para manipular datos sin errores de Mongoose
    const usuarioObj = usuarioEncontrado.toObject();

    res.json({ 
      msg: 'Login exitoso', 
      usuario: { 
        _id: usuarioObj._id,
        nombre: usuarioObj.nombre,
        email: usuarioObj.email,
        rol: usuarioObj.rol,
        // Enviamos el ID del albergue si es que tiene (para el Encargado)
        albergueId: usuarioObj.albergueId || null 
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;