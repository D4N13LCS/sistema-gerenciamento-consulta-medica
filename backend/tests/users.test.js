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

describe('Users API', () => {
  let token;

  beforeEach(async () => {
    token = await getAuthToken();
  });

  describe('GET /api/users', () => {
    it('should list users with valid token', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should reject without token', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: 'Novo Usuário',
          email: 'novo@test.com',
          senha: 'senha123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('novo@test.com');
      expect(res.body.data.senha).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'User 1', email: 'dup@test.com', senha: 'senha123' });

      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'User 2', email: 'dup@test.com', senha: 'senha123' });

      expect(res.status).toBe(409);
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: '', email: 'invalid', senha: '12' });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Update Test', email: 'update@test.com', senha: 'senha123' });

      const userId = createRes.body.data.id;

      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.nome).toBe('Updated Name');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .put('/api/users/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Test' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const createRes = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Delete Test', email: 'delete@test.com', senha: 'senha123' });

      const userId = createRes.body.data.id;

      const res = await request(app)
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
