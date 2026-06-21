const { body, param } = require('express-validator');
const { validateCRM, validatePhone } = require('../utils/validators');

const createDoctorValidator = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('especialidades')
    .isArray({ min: 1 }).withMessage('Pelo menos uma especialidade é obrigatória'),
  body('especialidades.*')
    .isMongoId().withMessage('Especialidade deve ser um ObjectId válido'),
  body('crm')
    .trim()
    .notEmpty().withMessage('CRM é obrigatório')
    .custom((value) => validateCRM(value)).withMessage('CRM inválido')
    .escape(),
  body('telefone')
    .trim()
    .notEmpty().withMessage('Telefone é obrigatório')
    .custom((value) => validatePhone(value)).withMessage('Telefone inválido')
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
  body('especialidades')
    .optional()
    .isArray().withMessage('Especialidades deve ser um array'),
  body('especialidades.*')
    .optional()
    .isMongoId().withMessage('Especialidade deve ser um ObjectId válido'),
  body('crm')
    .optional()
    .trim()
    .notEmpty().withMessage('CRM não pode ser vazio')
    .custom((value) => validateCRM(value)).withMessage('CRM inválido')
    .escape(),
  body('telefone')
    .optional()
    .trim()
    .notEmpty().withMessage('Telefone não pode ser vazio')
    .custom((value) => validatePhone(value)).withMessage('Telefone inválido')
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
