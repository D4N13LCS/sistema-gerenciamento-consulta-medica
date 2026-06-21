const request = require('supertest');
const createApp = require('../src/app');
const { seedAdminUser, cleanDatabase } = require('./setup');

const app = createApp();

const getAuthToken = async () => {
  await seedAdminUser();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', senha: 'admin123' });
  return res.body.data.token;
};

const createSpecialty = async (token, nome) => {
  const res = await request(app)
    .post('/api/specialties')
    .set('Authorization', `Bearer ${token}`)
    .send({ nome, descricao: `Descrição de ${nome}` });
  return res.body.data._id;
};

const createPatient = async (token, nome, cpf) => {
  const res = await request(app)
    .post('/api/patients')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome,
      dataNascimento: '1990-01-01',
      cpf: cpf || '52998224725',
      telefone: '11999990000',
      email: `${nome.toLowerCase().replace(/\s/g, '')}${Date.now()}@test.com`,
    });
  if (!res.body.data) {
    console.error('Patient creation failed:', res.status, res.body);
    throw new Error(`Patient creation failed: ${JSON.stringify(res.body)}`);
  }
  return res.body.data._id;
};

const createDoctor = async (token, nome, especialidades, crm) => {
  const res = await request(app)
    .post('/api/doctors')
    .set('Authorization', `Bearer ${token}`)
    .send({
      nome,
      especialidades,
      crm: crm || `CRM-${Math.floor(Math.random() * 100000)}`,
      telefone: '11999990000',
    });
  return res.body.data._id;
};

describe('Appointments API', () => {
  let token;
  let patientId;
  let doctorId;
  let specialtyId;
  let patientCounter = 0;
  let sampleAppointment;

  beforeEach(async () => {
    token = await getAuthToken();
    specialtyId = await createSpecialty(token, 'Cardiologia');
    patientCounter++;
    patientId = await createPatient(token, `Maria Santos ${patientCounter}`, '52998224725');
    doctorId = await createDoctor(token, `Dr. João Silva ${patientCounter}`, [specialtyId], `CRM-${10000 + patientCounter}`);
    
    sampleAppointment = {
      paciente: patientId,
      medico: doctorId,
      especialidade: specialtyId,
      data: '2026-07-15',
      horario: '14:30',
      observacoes: 'Primeira consulta',
      status: 'agendada',
    };
  });

  describe('POST /api/appointments', () => {
    it('should create an appointment', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleAppointment);

      expect(res.status).toBe(201);
      expect(res.body.data.paciente._id || res.body.data.paciente).toBe(sampleAppointment.paciente);
      expect(res.body.data.medico._id || res.body.data.medico).toBe(sampleAppointment.medico);
      expect(res.body.data.especialidade._id || res.body.data.especialidade).toBe(sampleAppointment.especialidade);
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
        .send({ paciente: patientId });

      expect(res.status).toBe(400);
    });

    it('should reject appointment with non-existent patient', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleAppointment, paciente: fakeId });

      expect(res.status).toBe(404);
    });

    it('should reject appointment with non-existent doctor', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleAppointment, medico: fakeId });

      expect(res.status).toBe(404);
    });

    it('should reject appointment with specialty not belonging to doctor', async () => {
      const otherSpecialtyId = await createSpecialty(token, 'Dermatologia');
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleAppointment, especialidade: otherSpecialtyId });

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
