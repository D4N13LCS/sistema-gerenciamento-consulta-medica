const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    dataNascimento: {
      type: String,
      required: true,
      trim: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 14,
    },
    telefone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    endereco: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    historicoExames: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    anamnese: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    observacoesMedicas: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
