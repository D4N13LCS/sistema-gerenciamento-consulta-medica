const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  data: {
    type: String,
    required: true,
    trim: true,
  },
  resultado: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: '',
  },
  observacoes: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: '',
  },
}, { _id: true, timestamps: true });

const patientSchema = new mongoose.Schema(
  {
    // Dados pessoais
    nome: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    dataNascimento: {
      type: String,
      required: true,
      trim: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 14,
    },
    telefone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    endereco: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },

    // Histórico médico
    historicoMedico: {
      doencasPreexistentes: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      alergias: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      medicamentosEmUso: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      cirurgiasAnteriores: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      historicoFamiliar: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      comorbidades: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
    },

    // Anamnese
    anamnese: {
      queixaPrincipal: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      historiaDoencaAtual: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      habitosVida: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      fatoresRisco: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
      observacoesClinicas: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: '',
      },
    },

    // Observações gerais
    observacoesGerais: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },

    // Histórico de exames (estruturado)
    exames: [examSchema],

    // Campos legados para compatibilidade
    historicoExames: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    observacoesMedicas: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
