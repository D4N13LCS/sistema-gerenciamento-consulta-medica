const { body, param } = require('express-validator');

const createAppointmentValidator = [
  body('paciente')
    .notEmpty().withMessage('Paciente é obrigatório')
    .isMongoId().withMessage('Paciente deve ser um ObjectId válido'),
  body('medico')
    .notEmpty().withMessage('Médico é obrigatório')
    .isMongoId().withMessage('Médico deve ser um ObjectId válido'),
  body('especialidade')
    .notEmpty().withMessage('Especialidade é obrigatória')
    .isMongoId().withMessage('Especialidade deve ser um ObjectId válido'),
  body('data')
    .trim()
    .notEmpty().withMessage('Data é obrigatória')
    .isISO8601().withMessage('Data inválida'),
  body('horario')
    .trim()
    .notEmpty().withMessage('Horário é obrigatório')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Horário deve estar no formato HH:MM'),
  body('observacoes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações devem ter no máximo 2000 caracteres')
    .escape(),
  body('status')
    .optional()
    .isIn(['agendada', 'confirmada', 'cancelada', 'concluida'])
    .withMessage('Status inválido'),
];

const updateAppointmentValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('paciente')
    .optional()
    .notEmpty().withMessage('Paciente não pode ser vazio')
    .isMongoId().withMessage('Paciente deve ser um ObjectId válido'),
  body('medico')
    .optional()
    .notEmpty().withMessage('Médico não pode ser vazio')
    .isMongoId().withMessage('Médico deve ser um ObjectId válido'),
  body('especialidade')
    .optional()
    .notEmpty().withMessage('Especialidade não pode ser vazia')
    .isMongoId().withMessage('Especialidade deve ser um ObjectId válido'),
  body('data')
    .optional()
    .trim()
    .isISO8601().withMessage('Data inválida'),
  body('horario')
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Horário deve estar no formato HH:MM'),
  body('observacoes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações devem ter no máximo 2000 caracteres')
    .escape(),
  body('status')
    .optional()
    .isIn(['agendada', 'confirmada', 'cancelada', 'concluida'])
    .withMessage('Status inválido'),
];

const mongoIdValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
];

module.exports = {
  createAppointmentValidator,
  updateAppointmentValidator,
  mongoIdValidator,
};
