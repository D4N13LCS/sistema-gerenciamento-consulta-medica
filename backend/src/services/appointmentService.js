const Appointment = require('../models/mongo/Appointment');

const AppointmentService = {
  async getAll() {
    return Appointment.find().sort({ data: -1, horario: -1 }).lean();
  },

  async getById(id) {
    const appointment = await Appointment.findById(id).lean();
    if (!appointment) {
      const error = new Error('Consulta não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return appointment;
  },

  async create(data) {
    const appointment = await Appointment.create(data);
    return appointment.toObject();
  },

  async update(id, data) {
    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!appointment) {
      const error = new Error('Consulta não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return appointment;
  },

  async delete(id) {
    const appointment = await Appointment.findByIdAndDelete(id).lean();
    if (!appointment) {
      const error = new Error('Consulta não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return appointment;
  },

  async count() {
    return Appointment.countDocuments();
  },
};

module.exports = AppointmentService;
