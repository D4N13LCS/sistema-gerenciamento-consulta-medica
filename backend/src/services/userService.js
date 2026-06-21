const UserModel = require('../models/postgres/User');
const AuthService = require('./authService');

const UserService = {
  async getAll() {
    return UserModel.findAll();
  },

  async getById(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  async create({ nome, email, senha }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await AuthService.hashPassword(senha);
    return UserModel.create({ nome, email, senha: hashedPassword });
  },

  async update(id, data) {
    await this.getById(id);

    if (data.email) {
      const existing = await UserModel.findByEmail(data.email);
      if (existing && existing.id !== parseInt(id, 10)) {
        const error = new Error('E-mail já cadastrado');
        error.statusCode = 409;
        throw error;
      }
    }

    const updateData = { ...data };
    if (data.senha) {
      updateData.senha = await AuthService.hashPassword(data.senha);
    }

    const user = await UserModel.update(id, updateData);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  async delete(id) {
    const user = await UserModel.delete(id);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return user;
  },

  async count() {
    return UserModel.count();
  },
};

module.exports = UserService;
