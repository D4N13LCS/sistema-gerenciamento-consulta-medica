const { body, param } = require('express-validator');

const createUserValidator = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage('Role deve ser user ou admin'),
];

const updateUserValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('senha')
    .optional()
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
];

const idParamValidator = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  idParamValidator,
};
