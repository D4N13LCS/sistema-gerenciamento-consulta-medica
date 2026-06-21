const express = require('express');
const PatientController = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createPatientValidator,
  updatePatientValidator,
  mongoIdValidator,
} = require('../validators/patientValidator');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Listar pacientes
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Lista de pacientes
 */
router.get('/', PatientController.getAll);

/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Buscar paciente por ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente encontrado
 */
router.get('/:id', mongoIdValidator, validate, PatientController.getById);

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Criar paciente
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Paciente criado
 */
router.post('/', createPatientValidator, validate, PatientController.create);

/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Atualizar paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente atualizado
 */
router.put('/:id', updatePatientValidator, validate, PatientController.update);

/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Excluir paciente
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paciente excluído
 */
router.delete('/:id', mongoIdValidator, validate, PatientController.delete);

module.exports = router;
