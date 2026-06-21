const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    especialidades: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialty',
      required: true,
    }],
    crm: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 50,
    },
    telefone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
