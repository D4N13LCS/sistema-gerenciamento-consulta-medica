const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { loginValidator } = require('../validators/authValidator');

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticar usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', loginValidator, validate, AuthController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Verificar autenticação
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
