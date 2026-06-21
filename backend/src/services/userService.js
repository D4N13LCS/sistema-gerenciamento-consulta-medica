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

  async create({ nome, email, senha, role = 'user' }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const error = new Error('E-mail já cadastrado');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await AuthService.hashPassword(senha);
    return UserModel.create({ nome, email, senha: hashedPassword, role });
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
    const user = await UserModel.findById(id);
    if (!user) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    // Prevent deletion of admin users
    if (user.role === 'admin') {
      const error = new Error('O usuário administrador não pode ser excluído');
      error.statusCode = 403;
      throw error;
    }
    
    const deleted = await UserModel.delete(id);
    if (!deleted) {
      const error = new Error('Usuário não encontrado');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  },

  async count() {
    return UserModel.count();
  },
};

module.exports = UserService;
