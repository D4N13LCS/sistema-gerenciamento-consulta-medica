const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    medico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    especialidade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialty',
      required: true,
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
