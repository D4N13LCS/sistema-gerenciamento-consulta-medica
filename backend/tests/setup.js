const { MongoMemoryServer } = require('mongodb-memory-server');
const { newDb } = require('pg-mem');
const {
  connectMongo,
  closeConnections,
  setTestPgPool,
  resetTestPgPool,
} = require('../src/config/database');
const UserModel = require('../src/models/postgres/User');
const Doctor = require('../src/models/mongo/Doctor');
const Specialty = require('../src/models/mongo/Specialty');
const Appointment = require('../src/models/mongo/Appointment');
const AuthService = require('../src/services/authService');

let mongoServer = null;
let pgMemDb = null;
let isInitialized = false;

const setupPostgresMem = () => {
  pgMemDb = newDb({ autoCreateForeignKeyIndices: true });

  pgMemDb.public.none(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      senha VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);

  const { Pool } = pgMemDb.adapters.createPg();
  const pool = new Pool();
  setTestPgPool(pool);
  return pool;
};

const initializeTestDb = async () => {
  if (isInitialized) return;

  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.NODE_ENV = 'test';

  setupPostgresMem();

  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  await connectMongo();

  isInitialized = true;
};

const cleanDatabase = async () => {
  const pool = require('../src/config/database').createPgPool();
  await pool.query('DELETE FROM users');
  await Doctor.deleteMany({});
  await Specialty.deleteMany({});
  await Appointment.deleteMany({});
};

const seedAdminUser = async () => {
  const hashedPassword = await AuthService.hashPassword('admin123');
  return UserModel.create({
    nome: 'Admin Test',
    email: 'admin@test.com',
    senha: hashedPassword,
  });
};

beforeAll(async () => {
  await initializeTestDb();
}, 60000);

afterEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await closeConnections();
  resetTestPgPool();
  if (mongoServer) {
    await mongoServer.stop();
  }
}, 30000);

module.exports = {
  initializeTestDb,
  cleanDatabase,
  seedAdminUser,
};
