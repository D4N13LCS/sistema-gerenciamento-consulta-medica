const { Pool } = require('pg');
const mongoose = require('mongoose');

let pgPool = null;
let testPgPool = null;

const createPgPool = () => {
  if (testPgPool) return testPgPool;
  if (pgPool) return pgPool;

  pgPool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'medical_user',
    password: process.env.POSTGRES_PASSWORD || 'medical_pass',
    database: process.env.POSTGRES_DB || 'medical_users',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  return pgPool;
};

const initPostgres = async () => {
  const pool = createPgPool();
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        senha VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);
  } finally {
    client.release();
  }

  return pool;
};

const connectMongo = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medical_appointments';
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  return mongoose.connection;
};

const closeConnections = async () => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
};

const setTestPgPool = (pool) => {
  testPgPool = pool;
};

const resetTestPgPool = () => {
  testPgPool = null;
};

module.exports = {
  createPgPool,
  initPostgres,
  connectMongo,
  closeConnections,
  setTestPgPool,
  resetTestPgPool,
};
