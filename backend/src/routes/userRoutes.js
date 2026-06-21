const express = require('express');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createUserValidator,
  updateUserValidator,
  idParamValidator,
} = require('../validators/userValidator');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 */
router.get('/', UserController.getAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', idParamValidator, validate, UserController.getById);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome, email, senha]
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 */
router.post('/', createUserValidator, validate, UserController.create);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualizar usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
router.put('/:id', updateUserValidator, validate, UserController.update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Excluir usuário
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário excluído
 */
router.delete('/:id', idParamValidator, validate, UserController.delete);

module.exports = router;
