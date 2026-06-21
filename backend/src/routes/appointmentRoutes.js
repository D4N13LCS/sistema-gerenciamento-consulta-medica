const express = require('express');
const AppointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const {
  createAppointmentValidator,
  updateAppointmentValidator,
  mongoIdValidator,
} = require('../validators/appointmentValidator');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar consultas
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de consultas
 */
router.get('/', AppointmentController.getAll);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Buscar consulta por ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta encontrada
 */
router.get('/:id', mongoIdValidator, validate, AppointmentController.getById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Criar consulta
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Consulta criada
 */
router.post('/', createAppointmentValidator, validate, AppointmentController.create);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualizar consulta
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta atualizada
 */
router.put('/:id', updateAppointmentValidator, validate, AppointmentController.update);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Excluir consulta
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consulta excluída
 */
router.delete('/:id', mongoIdValidator, validate, AppointmentController.delete);

module.exports = router;
