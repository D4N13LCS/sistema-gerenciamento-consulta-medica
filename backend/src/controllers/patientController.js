const PatientService = require('../services/patientService');

const PatientController = {
  async getAll(req, res, next) {
    try {
      const patients = await PatientService.getAll();
      res.json({ success: true, data: patients });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const patient = await PatientService.getById(req.params.id);
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const patient = await PatientService.create(req.body);
      res.status(201).json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const patient = await PatientService.update(req.params.id, req.body);
      res.json({ success: true, data: patient });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await PatientService.delete(req.params.id);
      res.json({ success: true, message: 'Paciente excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async addExam(req, res, next) {
    try {
      const patient = await PatientService.addExam(req.params.id, req.body);
      // Transform exames to exams for API compatibility
      const responseData = { ...patient, exams: patient.exames };
      res.json({ success: true, data: responseData });
    } catch (error) {
      next(error);
    }
  },

  async updateExam(req, res, next) {
    try {
      const patient = await PatientService.updateExam(req.params.id, req.params.examId, req.body);
      // Transform exames to exams for API compatibility
      const responseData = { ...patient, exams: patient.exames };
      res.json({ success: true, data: responseData });
    } catch (error) {
      next(error);
    }
  },

  async removeExam(req, res, next) {
    try {
      const patient = await PatientService.removeExam(req.params.id, req.params.examId);
      // Transform exames to exams for API compatibility
      const responseData = { ...patient, exams: patient.exames };
      res.json({ success: true, data: responseData });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = PatientController;
