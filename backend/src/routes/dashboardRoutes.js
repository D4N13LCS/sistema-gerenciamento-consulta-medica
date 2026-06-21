const express = require('express');
const DashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Obter estatísticas do dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Estatísticas retornadas
 */
router.get('/stats', DashboardController.getStats);

module.exports = router;
