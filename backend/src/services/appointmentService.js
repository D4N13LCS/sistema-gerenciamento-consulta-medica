const Appointment = require('../models/mongo/Appointment');
const Patient = require('../models/mongo/Patient');
const Doctor = require('../models/mongo/Doctor');
const Specialty = require('../models/mongo/Specialty');

const AppointmentService = {
  async getAll() {
    return Appointment.find()
      .populate('paciente')
      .populate('medico')
      .populate('especialidade')
      .sort({ data: -1, horario: -1 })
      .lean();
  },

  async getById(id) {
    const appointment = await Appointment.findById(id)
      .populate('paciente')
      .populate('medico')
      .populate('especialidade')
      .lean();
    if (!appointment) {
      const error = new Error('Consulta não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return appointment;
  },

  async create(data) {
    // Validate paciente exists
    const patient = await Patient.findById(data.paciente);
    if (!patient) {
      const error = new Error('Paciente não encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Validate medico exists
    const doctor = await Doctor.findById(data.medico).populate('especialidades');
    if (!doctor) {
      const error = new Error('Médico não encontrado');
      error.statusCode = 404;
      throw error;
    }

    // Validate especialidade exists
    const specialty = await Specialty.findById(data.especialidade);
    if (!specialty) {
      const error = new Error('Especialidade não encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Validate especialidade is compatible with medico
    const hasSpecialty = doctor.especialidades.some(
      (spec) => spec._id.toString() === data.especialidade.toString()
    );
    if (!hasSpecialty) {
      const error = new Error('O médico não possui esta especialidade');
      error.statusCode = 400;
      throw error;
    }

    const appointment = await Appointment.create(data);
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('paciente')
      .populate('medico')
      .populate('especialidade');
    return populatedAppointment.toObject();
  },

  async update(id, data) {
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      const error = new Error('Consulta não encontrada');
      error.statusCode = 404;
      throw error;
    }

    // Validate paciente exists if provided
    if (data.paciente) {
      const patient = await Patient.findById(data.paciente);
      if (!patient) {
        const error = new Error('Paciente não encontrado');
        error.statusCode = 404;
        throw error;
      }
    }

    // Validate medico exists if provided
    if (data.medico) {
      const doctor = await Doctor.findById(data.medico).populate('especialidades');
      if (!doctor) {
        const error = new Error('Médico não encontrado');
        error.statusCode = 404;
        throw error;
      }
    }

    // Validate especialidade exists if provided
    if (data.especialidade) {
      const specialty = await Specialty.findById(data.especialidade);
      if (!specialty) {
        const error = new Error('Especialidade não encontrada');
        error.statusCode = 404;
        throw error;
      }
    }

    // If both medico and especialidade are being updated, validate compatibility
    if (data.medico && data.especialidade) {
      const doctor = await Doctor.findById(data.medico).populate('especialidades');
      const hasSpecialty = doctor.especialidades.some(
        (spec) => spec._id.toString() === data.especialidade.toString()
      );
      if (!hasSpecialty) {
        const error = new Error('O médico não possui esta especialidade');
        error.statusCode = 400;
        throw error;
      }
    }

    // If only especialidade is being updated, validate compatibility with existing medico
    if (data.especialidade && !data.medico) {
      const doctor = await Doctor.findById(existingAppointment.medico).populate('especialidades');
      const hasSpecialty = doctor.especialidades.some(
        (spec) => spec._id.toString() === data.especialidade.toString()
      );
      if (!hasSpecialty) {
        const error = new Error('O médico não possui esta especialidade');
        error.statusCode = 400;
        throw error;
      }
    }

    // If only medico is being updated, validate compatibility with existing especialidade
    if (data.medico && !data.especialidade) {
      const doctor = await Doctor.findById(data.medico).populate('especialidades');
      const hasSpecialty = doctor.especialidades.some(
        (spec) => spec._id.toString() === existingAppointment.especialidade.toString()
      );
      if (!hasSpecialty) {
        const error = new Error('O médico não possui esta especialidade');
        error.statusCode = 400;
        throw error;
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('paciente')
      .populate('medico')
      .populate('especialidade')
      .lean();

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
