const { body, param } = require('express-validator');

const createDoctorValidator = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('especialidade')
    .trim()
    .notEmpty().withMessage('Especialidade é obrigatória')
    .isLength({ max: 255 }).withMessage('Especialidade deve ter no máximo 255 caracteres')
    .escape(),
  body('crm')
    .trim()
    .notEmpty().withMessage('CRM é obrigatório')
    .isLength({ max: 50 }).withMessage('CRM deve ter no máximo 50 caracteres')
    .escape(),
  body('telefone')
    .trim()
    .notEmpty().withMessage('Telefone é obrigatório')
    .isLength({ max: 20 }).withMessage('Telefone deve ter no máximo 20 caracteres')
    .escape(),
];

const updateDoctorValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('especialidade')
    .optional()
    .trim()
    .notEmpty().withMessage('Especialidade não pode ser vazia')
    .isLength({ max: 255 }).withMessage('Especialidade deve ter no máximo 255 caracteres')
    .escape(),
  body('crm')
    .optional()
    .trim()
    .notEmpty().withMessage('CRM não pode ser vazio')
    .isLength({ max: 50 }).withMessage('CRM deve ter no máximo 50 caracteres')
    .escape(),
  body('telefone')
    .optional()
    .trim()
    .notEmpty().withMessage('Telefone não pode ser vazio')
    .isLength({ max: 20 }).withMessage('Telefone deve ter no máximo 20 caracteres')
    .escape(),
];

const mongoIdValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
];

module.exports = {
  createDoctorValidator,
  updateDoctorValidator,
  mongoIdValidator,
};
