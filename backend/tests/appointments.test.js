const request = require('supertest');
const createApp = require('../src/app');
const { seedAdminUser } = require('./setup');

const app = createApp();

const getAuthToken = async () => {
  await seedAdminUser();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', senha: 'admin123' });
  return res.body.data.token;
};

describe('Appointments API', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();
  });

  const sampleAppointment = {
    paciente: 'Maria Santos',
    medico: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    data: '2026-07-15',
    horario: '14:30',
    observacoes: 'Primeira consulta',
    status: 'agendada',
  };

  describe('POST /api/appointments', () => {
    it('should create an appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleAppointment);

      expect(res.status).toBe(201);
      expect(res.body.data.paciente).toBe(sampleAppointment.paciente);
    });

    it('should reject invalid time format', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleAppointment, horario: '25:00' });

      expect(res.status).toBe(400);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ paciente: 'Test' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/appointments', () => {
    it('should list appointments', async () => {
      await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleAppointment);

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/appointments/:id', () => {
    it('should update an appointment', async () => {
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleAppointment);

      const res = await request(app)
        .put(`/api/appointments/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'confirmada' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('confirmada');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('should delete an appointment', async () => {
      const createRes = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleAppointment);

      const res = await request(app)
        .delete(`/api/appointments/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});

describe('Dashboard API', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();
  });

  it('should return dashboard stats', async () => {
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('totalUsuarios');
    expect(res.body.data).toHaveProperty('totalMedicos');
    expect(res.body.data).toHaveProperty('totalEspecialidades');
    expect(res.body.data).toHaveProperty('totalConsultas');
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
