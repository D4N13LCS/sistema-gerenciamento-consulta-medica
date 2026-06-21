const AppointmentService = require('../services/appointmentService');

const AppointmentController = {
  async getAll(req, res, next) {
    try {
      const appointments = await AppointmentService.getAll();
      res.json({ success: true, data: appointments });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const appointment = await AppointmentService.getById(req.params.id);
      res.json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const appointment = await AppointmentService.create(req.body);
      res.status(201).json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const appointment = await AppointmentService.update(req.params.id, req.body);
      res.json({ success: true, data: appointment });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await AppointmentService.delete(req.params.id);
      res.json({ success: true, message: 'Consulta excluída com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AppointmentController;
