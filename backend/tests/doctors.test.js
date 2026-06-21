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

describe('Doctors API', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();
  });

  const sampleDoctor = {
    nome: 'Dr. João Silva',
    especialidade: 'Cardiologia',
    crm: 'CRM-12345',
    telefone: '(11) 99999-0000',
  };

  describe('POST /api/doctors', () => {
    it('should create a doctor', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      expect(res.status).toBe(201);
      expect(res.body.data.nome).toBe(sampleDoctor.nome);
    });

    it('should reject duplicate CRM', async () => {
      await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      expect(res.status).toBe(409);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/doctors', () => {
    it('should list doctors', async () => {
      await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      const res = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/doctors/:id', () => {
    it('should update a doctor', async () => {
      const createRes = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      const res = await request(app)
        .put(`/api/doctors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Dr. João Atualizado' });

      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Dr. João Atualizado');
    });
  });

  describe('DELETE /api/doctors/:id', () => {
    it('should delete a doctor', async () => {
      const createRes = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleDoctor);

      const res = await request(app)
        .delete(`/api/doctors/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
