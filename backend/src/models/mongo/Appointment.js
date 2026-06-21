const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    paciente: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    medico: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    especialidade: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    data: {
      type: String,
      required: true,
      trim: true,
    },
    horario: {
      type: String,
      required: true,
      trim: true,
    },
    observacoes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: ['agendada', 'confirmada', 'cancelada', 'concluida'],
      default: 'agendada',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
