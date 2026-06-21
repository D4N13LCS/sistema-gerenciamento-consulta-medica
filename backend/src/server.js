require('dotenv').config();
const createApp = require('./app');
const { initPostgres, connectMongo } = require('./config/database');
const UserService = require('./services/userService');

const PORT = process.env.PORT || 3000;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectWithRetry = async (fn, label, maxRetries = 15) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      console.log(`Aguardando ${label}... tentativa ${attempt}/${maxRetries}`);
      await wait(2000);
    }
  }
};

const startServer = async () => {
  await connectWithRetry(initPostgres, 'PostgreSQL');
  await connectWithRetry(connectMongo, 'MongoDB');

  try {
    await UserService.create({
      nome: 'Administrador',
      email: 'admin@clinica.com',
      senha: 'admin123',
    });
    console.log('Usuário admin padrão criado (admin@clinica.com / admin123)');
  } catch {
    // Admin already exists
  }

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api/docs`);
  });
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
  });
}

module.exports = { startServer };
