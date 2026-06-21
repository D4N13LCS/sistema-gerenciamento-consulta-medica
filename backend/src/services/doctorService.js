const Doctor = require('../models/mongo/Doctor');

const handleMongoError = (error) => {
  if (error.code === 11000) {
    const err = new Error('CRM já cadastrado');
    err.statusCode = 409;
    throw err;
  }
  throw error;
};

const DoctorService = {
  async getAll() {
    return Doctor.find().populate('especialidades').sort({ nome: 1 }).lean();
  },

  async getById(id) {
    const doctor = await Doctor.findById(id).populate('especialidades').lean();
    if (!doctor) {
      const error = new Error('Médico não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return doctor;
  },

  async create(data) {
    try {
      const doctor = await Doctor.create(data);
      const populatedDoctor = await Doctor.findById(doctor._id).populate('especialidades');
      return populatedDoctor.toObject();
    } catch (error) {
      handleMongoError(error);
    }
  },

  async update(id, data) {
    try {
      // Filter out undefined values to allow partial updates
      const updateData = Object.keys(data).reduce((acc, key) => {
        if (data[key] !== undefined) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      const doctor = await Doctor.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).populate('especialidades').lean();

      if (!doctor) {
        const error = new Error('Médico não encontrado');
        error.statusCode = 404;
        throw error;
      }
      
      return doctor;
    } catch (error) {
      handleMongoError(error);
    }
  },

  async delete(id) {
    const doctor = await Doctor.findByIdAndDelete(id).lean();
    if (!doctor) {
      const error = new Error('Médico não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return doctor;
  },

  async count() {
    return Doctor.countDocuments();
  },
};

module.exports = DoctorService;
