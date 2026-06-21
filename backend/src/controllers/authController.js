const AuthService = require('../services/authService');

const AuthController = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const result = await AuthService.login(email, senha);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
