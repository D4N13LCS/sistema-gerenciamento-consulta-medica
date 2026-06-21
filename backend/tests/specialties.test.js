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

describe('Specialties API', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();
  });

  const sampleSpecialty = {
    nome: 'Cardiologia',
    descricao: 'Especialidade do coração',
  };

  describe('POST /api/specialties', () => {
    it('should create a specialty', async () => {
      const res = await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      expect(res.status).toBe(201);
      expect(res.body.data.nome).toBe(sampleSpecialty.nome);
    });

    it('should reject duplicate name', async () => {
      await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      const res = await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      expect(res.status).toBe(409);
    });
  });

  describe('GET /api/specialties', () => {
    it('should list specialties', async () => {
      await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      const res = await request(app)
        .get('/api/specialties')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/specialties/:id', () => {
    it('should update a specialty', async () => {
      const createRes = await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      const res = await request(app)
        .put(`/api/specialties/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ descricao: 'Descrição atualizada' });

      expect(res.status).toBe(200);
      expect(res.body.data.descricao).toBe('Descrição atualizada');
    });
  });

  describe('DELETE /api/specialties/:id', () => {
    it('should delete a specialty', async () => {
      const createRes = await request(app)
        .post('/api/specialties')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleSpecialty);

      const res = await request(app)
        .delete(`/api/specialties/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });
  });
});
