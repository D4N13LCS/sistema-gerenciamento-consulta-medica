const AppointmentService = require('../services/appointmentService');
const UserService = require('../services/userService');
const DoctorService = require('../services/doctorService');
const SpecialtyService = require('../services/specialtyService');

const DashboardController = {
  async getStats(req, res, next) {
    try {
      const [users, doctors, specialties, appointments] = await Promise.all([
        UserService.count(),
        DoctorService.count(),
        SpecialtyService.count(),
        AppointmentService.count(),
      ]);

      res.json({
        success: true,
        data: {
          totalUsuarios: users,
          totalMedicos: doctors,
          totalEspecialidades: specialties,
          totalConsultas: appointments,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = DashboardController;
