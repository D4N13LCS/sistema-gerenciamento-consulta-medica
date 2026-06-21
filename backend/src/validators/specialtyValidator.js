const { body, param } = require('express-validator');

const createSpecialtyValidator = [
  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Descrição deve ter no máximo 1000 caracteres')
    .escape(),
];

const updateSpecialtyValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  body('nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome não pode ser vazio')
    .isLength({ max: 255 }).withMessage('Nome deve ter no máximo 255 caracteres')
    .escape(),
  body('descricao')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Descrição deve ter no máximo 1000 caracteres')
    .escape(),
];

const mongoIdValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
];

module.exports = {
  createSpecialtyValidator,
  updateSpecialtyValidator,
  mongoIdValidator,
};
