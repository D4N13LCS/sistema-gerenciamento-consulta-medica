const express = require('express');
const SpecialtyController = require('../controllers/specialtyController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createSpecialtyValidator,
  updateSpecialtyValidator,
  mongoIdValidator,
} = require('../validators/specialtyValidator');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /specialties:
 *   get:
 *     summary: Listar especialidades
 *     tags: [Specialties]
 *     responses:
 *       200:
 *         description: Lista de especialidades
 */
router.get('/', SpecialtyController.getAll);

/**
 * @swagger
 * /specialties/{id}:
 *   get:
 *     summary: Buscar especialidade por ID
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidade encontrada
 */
router.get('/:id', mongoIdValidator, validate, SpecialtyController.getById);

/**
 * @swagger
 * /specialties:
 *   post:
 *     summary: Criar especialidade
 *     tags: [Specialties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Specialty'
 *     responses:
 *       201:
 *         description: Especialidade criada
 */
router.post('/', createSpecialtyValidator, validate, SpecialtyController.create);

/**
 * @swagger
 * /specialties/{id}:
 *   put:
 *     summary: Atualizar especialidade
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidade atualizada
 */
router.put('/:id', updateSpecialtyValidator, validate, SpecialtyController.update);

/**
 * @swagger
 * /specialties/{id}:
 *   delete:
 *     summary: Excluir especialidade
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Especialidade excluída
 */
router.delete('/:id', mongoIdValidator, validate, SpecialtyController.delete);

module.exports = router;
