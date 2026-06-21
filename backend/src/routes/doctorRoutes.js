const express = require('express');
const DoctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createDoctorValidator,
  updateDoctorValidator,
  mongoIdValidator,
} = require('../validators/doctorValidator');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Listar médicos
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get('/', DoctorController.getAll);

/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Buscar médico por ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médico encontrado
 */
router.get('/:id', mongoIdValidator, validate, DoctorController.getById);

/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Criar médico
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Médico criado
 */
router.post('/', createDoctorValidator, validate, DoctorController.create);

/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Atualizar médico
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médico atualizado
 */
router.put('/:id', updateDoctorValidator, validate, DoctorController.update);

/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Excluir médico
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Médico excluído
 */
router.delete('/:id', mongoIdValidator, validate, DoctorController.delete);

module.exports = router;
