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

  // Exam management methods
  async addExam(patientId, examData) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { $push: { exames: examData } },
        { new: true, runValidators: true }
      ).lean();

      if (!patient) {
        const error = new Error('Paciente não encontrado');
        error.statusCode = 404;
        throw error;
      }
      return patient;
    } catch (error) {
      if (error.statusCode) throw error;
      handleMongoError(error);
    }
  },

  async updateExam(patientId, examId, examData) {
    try {
      // First, find the patient to check if the exam exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        const error = new Error('Paciente não encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Check if the exam exists in the patient's exams array
      const examIndex = patient.exames.findIndex(exam => exam._id.toString() === examId.toString());
      if (examIndex === -1) {
        const error = new Error('Paciente ou exame não encontrado');
        error.statusCode = 404;
        throw error;
      }

      // Update the exam directly
      patient.exames[examIndex] = { ...patient.exames[examIndex].toObject(), ...examData };
      await patient.save();

      return patient.toObject();
    } catch (error) {
      if (error.statusCode) throw error;
      if (error.name === 'CastError' || error.name === 'ValidationError') {
        const err = new Error('Paciente ou exame não encontrado');
        err.statusCode = 404;
        throw err;
      }
      handleMongoError(error);
    }
  },

  async removeExam(patientId, examId) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { $pull: { exames: { _id: examId } } },
        { new: true }
      ).lean();

      if (!patient) {
        const error = new Error('Paciente não encontrado');
        error.statusCode = 404;
        throw error;
      }
      return patient;
    } catch (error) {
      if (error.statusCode) throw error;
      handleMongoError(error);
    }
  },
};

module.exports = PatientService;
