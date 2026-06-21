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

const createSpecialty = async (token, nome) => {
  const res = await request(app)
    .post('/api/specialties')
    .set('Authorization', `Bearer ${token}`)
    .send({ nome, descricao: `Descrição de ${nome}` });
  return res.body.data._id;
};

describe('Doctors API', () => {
  let token;
  let specialtyId1;
  let specialtyId2;

  beforeEach(async () => {
    token = await getAuthToken();
    specialtyId1 = await createSpecialty(token, 'Cardiologia');
    specialtyId2 = await createSpecialty(token, 'Dermatologia');
  });

  const sampleDoctor = {
    nome: 'Dr. João Silva',
    especialidades: [], // Will be filled in tests
    crm: 'CRM-12345',
    telefone: '11999990000',
  };

  describe('POST /api/doctors', () => {
    it('should create a doctor', async () => {
      const doctorData = { ...sampleDoctor, especialidades: [specialtyId1] };
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      expect(res.status).toBe(201);
      expect(res.body.data.nome).toBe(sampleDoctor.nome);
    });

    it('should reject duplicate CRM', async () => {
      const doctorData = { ...sampleDoctor, especialidades: [specialtyId1] };
      await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      expect(res.status).toBe(409);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '' });

      expect(res.status).toBe(400);
    });

    it('should reject doctor without specialties', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleDoctor, especialidades: [] });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/doctors', () => {
    it('should list doctors', async () => {
      const doctorData = { ...sampleDoctor, especialidades: [specialtyId1] };
      await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      const res = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/doctors/:id', () => {
    it('should update a doctor', async () => {
      const doctorData = { ...sampleDoctor, especialidades: [specialtyId1] };
      const createRes = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      const res = await request(app)
        .put(`/api/doctors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Dr. João Atualizado', especialidades: [specialtyId1, specialtyId2] });

      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Dr. João Atualizado');
    });
  });

  describe('DELETE /api/doctors/:id', () => {
    it('should delete a doctor', async () => {
      const doctorData = { ...sampleDoctor, especialidades: [specialtyId1] };
      const createRes = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(doctorData);

      const res = await request(app)
        .delete(`/api/doctors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
