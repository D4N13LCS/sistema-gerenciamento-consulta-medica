const UserService = require('../services/userService');

const UserController = {
  async getAll(req, res, next) {
    try {
      const users = await UserService.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const user = await UserService.getById(req.params.id);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const user = await UserService.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await UserService.update(req.params.id, req.body);
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await UserService.delete(req.params.id);
      res.json({ success: true, message: 'Usuário excluído com sucesso' });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = UserController;
