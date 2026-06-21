const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/postgres/User');

const SALT_ROUNDS = 12;

const AuthService = {
  async login(email, senha) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await bcrypt.compare(senha, user.senha);
    if (!isValid) {
      const error = new Error('Credenciais inválidas');
      error.statusCode = 401;
      throw error;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const error = new Error('Configuração JWT ausente');
      error.statusCode = 500;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  },

  async hashPassword(senha) {
    return bcrypt.hash(senha, SALT_ROUNDS);
  },
};

module.exports = AuthService;
