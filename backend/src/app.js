require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const createApp = () => {
  const app = express();

  app.use(helmet());

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  app.use(cors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: false, limit: '10kb' }));
  app.use(mongoSanitize());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Muitas requisições. Tente novamente mais tarde.',
    },
  });
  app.use('/api', limiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      success: false,
      message: 'Muitas tentativas de login. Tente novamente mais tarde.',
    },
  });
  app.use('/api/auth/login', authLimiter);

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Medical Appointments API',
  }));

  app.use('/api', routes);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Rota não encontrada' });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
