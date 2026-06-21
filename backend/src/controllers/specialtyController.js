const SpecialtyService = require('../services/specialtyService');

const SpecialtyController = {
  async getAll(req, res, next) {
    try {
      const specialties = await SpecialtyService.getAll();
      res.json({ success: true, data: specialties });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const specialty = await SpecialtyService.getById(req.params.id);
      res.json({ success: true, data: specialty });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const specialty = await SpecialtyService.create(req.body);
      res.status(201).json({ success: true, data: specialty });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const specialty = await SpecialtyService.update(req.params.id, req.body);
      res.json({ success: true, data: specialty });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await SpecialtyService.delete(req.params.id);
      res.json({ success: true, message: 'Especialidade excluída com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = SpecialtyController;
