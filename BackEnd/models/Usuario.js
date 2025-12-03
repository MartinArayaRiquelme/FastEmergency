import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: 'usuario', 
    enum: ['usuario', 'coordinador', 'encargado_albergue'] // <--- ¿Está 'encargado_albergue' aquí?
  },
  // --- ESTA PARTE ES LA QUE BORRA EL ERROR ROJO ---
  albergueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Albergue'
  },
  // -----------------------------------------------
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;