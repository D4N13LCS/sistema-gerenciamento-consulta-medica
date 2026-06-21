const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Agendamento de Consultas Médicas',
      version: '1.0.0',
      description: 'API REST para gerenciamento de consultas médicas, usuários, médicos e especialidades',
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Doctor: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nome: { type: 'string' },
            especialidade: { type: 'string' },
            crm: { type: 'string' },
            telefone: { type: 'string' },
          },
        },
        Specialty: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nome: { type: 'string' },
            descricao: { type: 'string' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            paciente: { type: 'string' },
            medico: { type: 'string' },
            especialidade: { type: 'string' },
            data: { type: 'string', format: 'date' },
            horario: { type: 'string' },
            observacoes: { type: 'string' },
            status: {
              type: 'string',
              enum: ['agendada', 'confirmada', 'cancelada', 'concluida'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
