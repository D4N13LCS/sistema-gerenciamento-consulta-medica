const request = require('supertest');
const createApp = require('../src/app');
const { seedAdminUser } = require('./setup');

const app = createApp();

describe('Auth API', () => {
  beforeEach(async () => {
    await seedAdminUser();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', senha: 'admin123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('admin@test.com');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', senha: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid', senha: 'admin123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user data with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', senha: 'admin123' });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('admin@test.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
