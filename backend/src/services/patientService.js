const Patient = require('../models/mongo/Patient');

const handleMongoError = (error) => {
  if (error.code === 11000) {
    const err = new Error('CPF já cadastrado');
    err.statusCode = 409;
    throw err;
  }
  throw error;
};

const PatientService = {
  async getAll() {
    return Patient.find().sort({ nome: 1 }).lean();
  },

  async getById(id) {
    const patient = await Patient.findById(id).lean();
    if (!patient) {
      const error = new Error('Paciente não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return patient;
  },

  async create(data) {
    try {
      const patient = await Patient.create(data);
      return patient.toObject();
    } catch (error) {
      handleMongoError(error);
    }
  },

  async update(id, data) {
    try {
      const patient = await Patient.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).lean();

      if (!patient) {
        const error = new Error('Paciente não encontrado');
        error.statusCode = 404;
        throw error;
      }
      return patient;
    } catch (error) {
      handleMongoError(error);
    }
  },

  async delete(id) {
    const patient = await Patient.findByIdAndDelete(id).lean();
    if (!patient) {
      const error = new Error('Paciente não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return patient;
  },

  async count() {
    return Patient.countDocuments();
  },
};

module.exports = PatientService;
