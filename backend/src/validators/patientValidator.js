const { body, param } = require('express-validator');
const { validateCPF, validateDateOfBirth, validateEmail, validatePhone } = require('../utils/validators');

const createPatientValidator = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('dataNascimento')
    .trim()
    .notEmpty().withMessage('Data de nascimento é obrigatória')
    .isISO8601().withMessage('Data de nascimento inválida')
    .custom((value) => validateDateOfBirth(value)).withMessage('Data de nascimento não pode ser futura'),
  body('cpf')
    .trim()
    .notEmpty().withMessage('CPF é obrigatório')
    .custom((value) => validateCPF(value)).withMessage('CPF inválido')
    .escape(),
  body('telefone')
    .trim()
    .notEmpty().withMessage('Telefone é obrigatório')
    .custom((value) => validatePhone(value)).withMessage('Telefone inválido')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .isLength({ max: 255 }).withMessage('Email deve ter no máximo 255 caracteres')
    .normalizeEmail(),
  body('endereco')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Endereço deve ter no máximo 500 caracteres')
    .escape(),
  body('historicoExames')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Histórico de exames deve ter no máximo 5000 caracteres')
    .escape(),
  body('anamnese')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Anamnese deve ter no máximo 5000 caracteres')
    .escape(),
  body('observacoesMedicas')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Observações médicas devem ter no máximo 5000 caracteres')
    .escape(),
];

const updatePatientValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('dataNascimento')
    .optional()
    .trim()
    .isISO8601().withMessage('Data de nascimento inválida')
    .custom((value) => validateDateOfBirth(value)).withMessage('Data de nascimento não pode ser futura'),
  body('cpf')
    .optional()
    .trim()
    .notEmpty().withMessage('CPF não pode ser vazio')
    .custom((value) => validateCPF(value)).withMessage('CPF inválido')
    .escape(),
  body('telefone')
    .optional()
    .trim()
    .notEmpty().withMessage('Telefone não pode ser vazio')
    .custom((value) => validatePhone(value)).withMessage('Telefone inválido')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Email inválido')
    .isLength({ max: 255 }).withMessage('Email deve ter no máximo 255 caracteres')
    .normalizeEmail(),
  body('endereco')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Endereço deve ter no máximo 500 caracteres')
    .escape(),
  body('historicoExames')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Histórico de exames deve ter no máximo 5000 caracteres')
    .escape(),
  body('anamnese')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Anamnese deve ter no máximo 5000 caracteres')
    .escape(),
  body('observacoesMedicas')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Observações médicas devem ter no máximo 5000 caracteres')
    .escape(),
];

const mongoIdValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
];

module.exports = {
  createPatientValidator,
  updatePatientValidator,
  mongoIdValidator,
};
