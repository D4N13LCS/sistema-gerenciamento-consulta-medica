const DoctorService = require('../services/doctorService');

const DoctorController = {
  async getAll(req, res, next) {
    try {
      const doctors = await DoctorService.getAll();
      res.json({ success: true, data: doctors });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const doctor = await DoctorService.getById(req.params.id);
      res.json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const doctor = await DoctorService.create(req.body);
      res.status(201).json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const doctor = await DoctorService.update(req.params.id, req.body);
      res.json({ success: true, data: doctor });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await DoctorService.delete(req.params.id);
      res.json({ success: true, message: 'Médico excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = DoctorController;
