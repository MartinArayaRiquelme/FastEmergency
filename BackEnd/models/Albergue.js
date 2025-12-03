import mongoose from 'mongoose';

const albergueSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Ej: "Gimnasio Municipal"
  ubicacion: { type: String, required: true }, // Ej: "Av. Siempre Viva 123"
  actividad: { type: String, required: true }, // Ej: "Acopio y Logística"
  capacidadMaxima: { type: Number, required: true, default: 20 }, // Cuántos voluntarios caben
  voluntariosActuales: { type: Number, default: 0 } // Contador simple
});

const Albergue = mongoose.model('Albergue', albergueSchema);
export default Albergue;