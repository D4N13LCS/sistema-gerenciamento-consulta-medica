const { body, param } = require('express-validator');
const { validateCPF, validateDateOfBirth, validateEmail, validatePhone } = require('../utils/validators');

const createPatientValidator = [
  // Dados pessoais
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

  // Histórico médico
  body('historicoMedico.doencasPreexistentes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Doenças pré-existentes deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.alergias')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Alergias deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.medicamentosEmUso')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Medicamentos em uso deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.cirurgiasAnteriores')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Cirurgias anteriores deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.historicoFamiliar')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Histórico familiar deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.comorbidades')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Comorbidades deve ter no máximo 2000 caracteres')
    .escape(),

  // Anamnese
  body('anamnese.queixaPrincipal')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Queixa principal deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.historiaDoencaAtual')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('História da doença atual deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.habitosVida')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Hábitos de vida deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.fatoresRisco')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Fatores de risco deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.observacoesClinicas')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações clínicas deve ter no máximo 2000 caracteres')
    .escape(),

  // Observações gerais
  body('observacoesGerais')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Observações gerais devem ter no máximo 5000 caracteres')
    .escape(),

  // Exames
  body('exames')
    .optional()
    .isArray().withMessage('Exames deve ser um array'),
  body('exames.*.nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome do exame é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome do exame deve ter no máximo 255 caracteres')
    .escape(),
  body('exames.*.data')
    .optional()
    .trim()
    .notEmpty().withMessage('Data do exame é obrigatória')
    .isISO8601().withMessage('Data do exame inválida')
    .escape(),
  body('exames.*.resultado')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Resultado do exame deve ter no máximo 2000 caracteres')
    .escape(),
  body('exames.*.observacoes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações do exame devem ter no máximo 2000 caracteres')
    .escape(),

  // Campos legados para compatibilidade
  body('historicoExames')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Histórico de exames deve ter no máximo 5000 caracteres')
    .escape(),
  body('observacoesMedicas')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Observações médicas devem ter no máximo 5000 caracteres')
    .escape(),
];

const updatePatientValidator = [
  param('id').isMongoId().withMessage('ID inválido'),
  
  // Dados pessoais
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

  // Histórico médico
  body('historicoMedico.doencasPreexistentes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Doenças pré-existentes deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.alergias')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Alergias deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.medicamentosEmUso')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Medicamentos em uso deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.cirurgiasAnteriores')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Cirurgias anteriores deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.historicoFamiliar')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Histórico familiar deve ter no máximo 2000 caracteres')
    .escape(),
  body('historicoMedico.comorbidades')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Comorbidades deve ter no máximo 2000 caracteres')
    .escape(),

  // Anamnese
  body('anamnese.queixaPrincipal')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Queixa principal deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.historiaDoencaAtual')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('História da doença atual deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.habitosVida')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Hábitos de vida deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.fatoresRisco')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Fatores de risco deve ter no máximo 2000 caracteres')
    .escape(),
  body('anamnese.observacoesClinicas')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações clínicas deve ter no máximo 2000 caracteres')
    .escape(),

  // Observações gerais
  body('observacoesGerais')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Observações gerais devem ter no máximo 5000 caracteres')
    .escape(),

  // Exames
  body('exames')
    .optional()
    .isArray().withMessage('Exames deve ser um array'),
  body('exames.*.nome')
    .optional()
    .trim()
    .notEmpty().withMessage('Nome do exame é obrigatório')
    .isLength({ max: 255 }).withMessage('Nome do exame deve ter no máximo 255 caracteres')
    .escape(),
  body('exames.*.data')
    .optional()
    .trim()
    .notEmpty().withMessage('Data do exame é obrigatória')
    .isISO8601().withMessage('Data do exame inválida')
    .escape(),
  body('exames.*.resultado')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Resultado do exame deve ter no máximo 2000 caracteres')
    .escape(),
  body('exames.*.observacoes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Observações do exame devem ter no máximo 2000 caracteres')
    .escape(),

  // Campos legados para compatibilidade
  body('historicoExames')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Histórico de exames deve ter no máximo 5000 caracteres')
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

const examIdValidator = [
  param('id').isMongoId().withMessage('ID do paciente inválido'),
  param('examId').isMongoId().withMessage('ID do exame inválido'),
];

module.exports = {
  createPatientValidator,
  updatePatientValidator,
  mongoIdValidator,
  examIdValidator,
};
