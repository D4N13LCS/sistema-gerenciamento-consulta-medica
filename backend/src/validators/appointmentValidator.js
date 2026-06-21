const { body, param } = require('express-validator');

const createAppointmentValidator = [
  body('paciente')
    .trim()
    .notEmpty().withMessage('Paciente é obrigatório')
    .isLength({ max: 255 }).withMessage('Paciente deve ter no máximo 255 caracteres')
    .escape(),
  body('medico')
    .trim()
    .notEmpty().withMessage('Médico é obrigatório')
    .isLength({ max: 255 }).withMessage('Médico deve ter no máximo 255 caracteres')
    .escape(),
  body('especialidade')
    .trim()
    .notEmpty().withMessage('Especialidade é obrigatória')
    .isLength({ max: 255 }).withMessage('Especialidade deve ter no máximo 255 caracteres')
    .escape(),
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
    .trim()
    .notEmpty().withMessage('Paciente não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Paciente deve ter no máximo 255 caracteres')
    .escape(),
  body('medico')
    .optional()
    .trim()
    .notEmpty().withMessage('Médico não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Médico deve ter no máximo 255 caracteres')
    .escape(),
  body('especialidade')
    .optional()
    .trim()
    .notEmpty().withMessage('Especialidade não pode ser vazia')
    .isLength({ max: 255 }).withMessage('Especialidade deve ter no máximo 255 caracteres')
    .escape(),
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
