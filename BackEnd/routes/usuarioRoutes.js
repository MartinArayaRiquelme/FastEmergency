import express from 'express';
import Usuario from '../models/Usuario.js'; // Importamos el modelo que creaste antes

const router = express.Router();

// RUTA: Crear un nuevo usuario (POST)
// Dirección final: http://localhost:3000/api/usuarios
router.post('/', async (req, res) => {
  try {
    const datosUsuario = req.body;

    // --- VALIDACIÓN DE SEGURIDAD ---
    if (!datosUsuario.email.endsWith('@gmail.com')) {
        return res.status(400).json({ msg: 'Solo se permiten correos @gmail.com' });
    }
    // -------------------------------

    // ... el resto de tu código igual (new Usuario, save, etc.)
    const nuevoUsuario = new Usuario(datosUsuario);
    const usuarioGuardado = await nuevoUsuario.save();
    
    res.status(201).json(usuarioGuardado);

  } catch (error) {
    // ... tu manejo de errores
  }
});

// RUTA: Iniciar Sesión (Login)
// Dirección: POST http://localhost:3000/api/usuarios/login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Buscar si el correo existe
      const usuarioEncontrado = await Usuario.findOne({ email });
      if (!usuarioEncontrado) {
        return res.status(404).json({ msg: 'Usuario no encontrado' });
      }

      // 2. Verificar la contraseña
      if (usuarioEncontrado.password !== password) {
        return res.status(400).json({ msg: 'Contraseña incorrecta' });
      }

      // 3. Si todo coincide, convertimos a objeto simple para evitar errores
      const usuarioObj = usuarioEncontrado.toObject();

      res.json({ 
        msg: 'Login exitoso', 
        usuario: { 
          _id: usuarioObj._id,
          nombre: usuarioObj.nombre,
          email: usuarioObj.email,
          rol: usuarioObj.rol,
          // Ahora accedemos al objeto simple, el editor ya no marcará error
          albergueId: usuarioObj.albergueId || null 
        }
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
export default router;