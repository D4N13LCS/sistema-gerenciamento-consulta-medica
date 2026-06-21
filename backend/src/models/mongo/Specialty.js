const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 255,
    },
    descricao: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Specialty', specialtySchema);
