const request = require('supertest');
const createApp = require('../src/app');
const { cleanDatabase, seedAdminUser } = require('./setup');

const app = createApp();

const getAuthToken = async () => {
  await seedAdminUser();
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', senha: 'admin123' });
  return res.body.data.token;
};

describe('Patients API', () => {
  let token;

  beforeEach(async () => {
    await cleanDatabase();
    token = await getAuthToken();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/patients', () => {
    it('should create a patient', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
        endereco: 'Rua Teste, 123',
        historicoMedico: {
          doencasPreexistentes: 'Diabetes tipo 2',
          alergias: 'Penicilina',
          medicamentosEmUso: 'Metformina',
          cirurgiasAnteriores: 'Apendicectomia',
          historicoFamiliar: 'Hipertensão',
          comorbidades: 'Obesidade',
        },
        anamnese: {
          queixaPrincipal: 'Dor de cabeça',
          historiaDoencaAtual: 'Dor há 3 meses',
          habitosVida: 'Sedentário',
          fatoresRisco: 'Estresse',
          observacoesClinicas: 'Paciente orientado',
        },
        observacoesGerais: 'Paciente em acompanhamento regular',
        exames: [
          {
            nome: 'Hemograma',
            data: '2024-01-15',
            resultado: 'Normal',
            observacoes: 'Sem alterações',
          },
        ],
      };

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nome).toBe(patientData.nome);
      expect(res.body.data.cpf).toBe(patientData.cpf);
      expect(res.body.data.historicoMedico.doencasPreexistentes).toBe(patientData.historicoMedico.doencasPreexistentes);
      expect(res.body.data.anamnese.queixaPrincipal).toBe(patientData.anamnese.queixaPrincipal);
      expect(res.body.data.exames).toHaveLength(1);
      expect(res.body.data.exames[0].nome).toBe(patientData.exames[0].nome);
    });

    it('should reject duplicate CPF', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...patientData,
          email: 'joao.silva2@test.com',
        })
        .expect(409);

      expect(res.body.message).toBe('CPF já cadastrado');
    });

    it('should reject invalid data', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nome: '',
          dataNascimento: 'invalid-date',
          cpf: 'invalid-cpf',
          telefone: 'invalid-phone',
          email: 'invalid-email',
        })
        .expect(400);

      expect(res.body.errors).toBeDefined();
    });
  });

  describe('GET /api/patients', () => {
    it('should list patients', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData);

      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].nome).toBe(patientData.nome);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should get a patient by ID', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
        historicoMedico: {
          doencasPreexistentes: 'Diabetes',
        },
        exames: [
          {
            nome: 'Hemograma',
            data: '2024-01-15',
            resultado: 'Normal',
          },
        ],
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const res = await request(app)
        .get(`/api/patients/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nome).toBe(patientData.nome);
      expect(res.body.data.historicoMedico.doencasPreexistentes).toBe(patientData.historicoMedico.doencasPreexistentes);
      expect(res.body.data.exames).toHaveLength(1);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .get('/api/patients/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(res.body.message).toBe('Paciente não encontrado');
    });
  });

  describe('PUT /api/patients/:id', () => {
    it('should update a patient', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const updateData = {
        nome: 'João Silva Jr.',
        endereco: 'Nova Rua, 456',
        historicoMedico: {
          doencasPreexistentes: 'Diabetes tipo 2',
          alergias: 'Penicilina',
        },
      };

      const res = await request(app)
        .put(`/api/patients/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.nome).toBe(updateData.nome);
      expect(res.body.data.endereco).toBe(updateData.endereco);
      expect(res.body.data.historicoMedico.doencasPreexistentes).toBe(updateData.historicoMedico.doencasPreexistentes);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .put('/api/patients/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Teste' })
        .expect(404);

      expect(res.body.message).toBe('Paciente não encontrado');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should delete a patient', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const res = await request(app)
        .delete(`/api/patients/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Paciente excluído com sucesso');
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .delete('/api/patients/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(res.body.message).toBe('Paciente não encontrado');
    });
  });

  describe('POST /api/patients/:id/exams', () => {
    it('should add an exam to a patient', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const examData = {
        nome: 'Raio-X',
        data: '2024-02-01',
        resultado: 'Normal',
        observacoes: 'Sem alterações',
      };

      const res = await request(app)
        .post(`/api/patients/${createRes.body.data._id}/exams`)
        .set('Authorization', `Bearer ${token}`)
        .send(examData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.exames).toHaveLength(1);
      expect(res.body.data.exames[0].nome).toBe(examData.nome);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .post('/api/patients/507f1f77bcf86cd799439011/exams')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Teste', data: '2024-01-01' })
        .expect(404);

      expect(res.body.message).toBe('Paciente não encontrado');
    });
  });

  describe('PUT /api/patients/:id/exams/:examId', () => {
    it('should update an exam', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      // Add an exam first
      const examData = {
        nome: 'Hemograma',
        data: '2024-01-15',
        resultado: 'Pendente',
      };

      const addRes = await request(app)
        .post(`/api/patients/${createRes.body.data._id}/exams`)
        .set('Authorization', `Bearer ${token}`)
        .send(examData)
        .expect(200);

      const examId = addRes.body.data.exams[0]._id;
      const updateData = {
        nome: 'Hemograma Completo',
        resultado: 'Normal',
        observacoes: 'Sem alterações',
      };

      const res = await request(app)
        .put(`/api/patients/${createRes.body.data._id}/exams/${examId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.exams[0].nome).toBe(updateData.nome);
      expect(res.body.data.exames[0].resultado).toBe(updateData.resultado);
    });

    it('should return 404 for non-existent exam', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      const res = await request(app)
        .put(`/api/patients/${createRes.body.data._id}/exams/507f1f77bcf86cd799439011`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Teste' })
        .expect(404);

      expect(res.body.message).toBe('Paciente ou exame não encontrado');
    });
  });

  describe('DELETE /api/patients/:id/exams/:examId', () => {
    it('should remove an exam', async () => {
      const patientData = {
        nome: 'João Silva',
        dataNascimento: '1990-01-01',
        cpf: '52998224725',
        telefone: '11999990000',
        email: 'joao.silva@test.com',
      };

      const createRes = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${token}`)
        .send(patientData)
        .expect(201);

      // Add an exam first
      const examData = {
        nome: 'Hemograma',
        data: '2024-01-15',
        resultado: 'Normal',
      };

      const addRes = await request(app)
        .post(`/api/patients/${createRes.body.data._id}/exams`)
        .set('Authorization', `Bearer ${token}`)
        .send(examData)
        .expect(200);

      const examId = addRes.body.data.exams[0]._id;

      const res = await request(app)
        .delete(`/api/patients/${createRes.body.data._id}/exams/${examId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.exames).toHaveLength(0);
    });

    it('should return 404 for non-existent patient', async () => {
      const res = await request(app)
        .delete('/api/patients/507f1f77bcf86cd799439011/exams/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(res.body.message).toBe('Paciente não encontrado');
    });
  });
});
