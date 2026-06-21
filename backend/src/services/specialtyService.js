const Specialty = require('../models/mongo/Specialty');

const handleMongoError = (error) => {
  if (error.code === 11000) {
    const err = new Error('Especialidade já cadastrada');
    err.statusCode = 409;
    throw err;
  }
  throw error;
};

const SpecialtyService = {
  async getAll() {
    return Specialty.find().sort({ nome: 1 }).lean();
  },

  async getById(id) {
    const specialty = await Specialty.findById(id).lean();
    if (!specialty) {
      const error = new Error('Especialidade não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return specialty;
  },

  async create(data) {
    try {
      const specialty = await Specialty.create(data);
      return specialty.toObject();
    } catch (error) {
      handleMongoError(error);
    }
  },

  async update(id, data) {
    try {
      const specialty = await Specialty.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      }).lean();

      if (!specialty) {
        const error = new Error('Especialidade não encontrada');
        error.statusCode = 404;
        throw error;
      }
      return specialty;
    } catch (error) {
      handleMongoError(error);
    }
  },

  async delete(id) {
    const specialty = await Specialty.findByIdAndDelete(id).lean();
    if (!specialty) {
      const error = new Error('Especialidade não encontrada');
      error.statusCode = 404;
      throw error;
    }
    return specialty;
  },

  async count() {
    return Specialty.countDocuments();
  },
};

module.exports = SpecialtyService;
