import mongoose, { Schema } from "mongoose";

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 30,
  },
  apellido: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 40,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 60,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
   
  },
  estado: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
});

const Usuario = mongoose.model(`usuario`, usuarioSchema);

export default Usuario;
