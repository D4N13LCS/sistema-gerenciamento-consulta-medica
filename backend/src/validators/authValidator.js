const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('senha')
    .notEmpty().withMessage('Senha é obrigatória'),
];

module.exports = { loginValidator };
