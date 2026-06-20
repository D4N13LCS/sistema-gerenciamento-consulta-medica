# ClínicaMed — Sistema de Agendamento de Consultas Médicas

Aplicação full stack para gerenciamento de consultas médicas, médicos, especialidades e usuários, com autenticação JWT, interface administrativa responsiva e containerização via Docker.

## Arquitetura

```
┌─────────────┐     HTTP/REST      ┌─────────────┐
│   Frontend  │ ◄───────────────► │   Backend   │
│  React/Vite │   JWT Bearer       │   Express   │
│  Tailwind 4 │                    │             │
└─────────────┘                    └──────┬──────┘
                                          │
                              ┌───────────┴───────────┐
                              │                       │
                        ┌─────▼─────┐         ┌───────▼──────┐
                        │ PostgreSQL │         │   MongoDB    │
                        │  (Users)   │         │ Doctors,     │
                        └────────────┘         │ Specialties, │
                                               │ Appointments │
                                               └──────────────┘
```

### Backend (Node.js + Express)

| Camada | Responsabilidade |
|--------|------------------|
| `controllers/` | Recebe requisições e retorna respostas HTTP |
| `services/` | Regras de negócio |
| `models/` | Acesso a dados (PostgreSQL e MongoDB) |
| `routes/` | Definição de rotas e documentação Swagger |
| `middlewares/` | Autenticação JWT, validação, tratamento de erros |
| `validators/` | Validação e sanitização de entradas |
| `config/` | Conexões de banco e Swagger |

### Frontend (React + Vite)

| Camada | Responsabilidade |
|--------|------------------|
| `pages/` | Telas da aplicação |
| `components/` | Componentes reutilizáveis (Table, Modal, Button...) |
| `layouts/` | Layout do painel administrativo |
| `contexts/` | AuthContext e ToastContext |
| `services/` | Comunicação HTTP centralizada via Axios |
| `routes/` | Rotas protegidas e públicas |
| `utils/` | Helpers de autenticação e formatação |

## Tecnologias

### Backend
- **Node.js 20** + **Express 4**
- **PostgreSQL 16** — usuários (CRUD relacional)
- **MongoDB 7** — médicos, especialidades e consultas (CRUD NoSQL)
- **JWT** — autenticação stateless
- **Helmet, CORS, bcrypt, express-rate-limit, express-mongo-sanitize** — segurança
- **Swagger** — documentação automática da API
- **Jest + Supertest** — testes de integração

### Frontend
- **React 19** + **Vite 6**
- **Tailwind CSS v4** — estilização utilitária
- **React Router DOM v7** — roteamento SPA
- **Axios** — cliente HTTP
- **Vitest + React Testing Library** — testes

### Infraestrutura
- **Docker** + **Docker Compose** — orquestração de todos os serviços

## Autenticação JWT

1. O usuário envia `POST /api/auth/login` com e-mail e senha.
2. O backend valida credenciais (bcrypt) e retorna um token JWT.
3. O frontend armazena o token em `localStorage`.
4. Todas as requisições protegidas incluem `Authorization: Bearer <token>`.
5. O middleware `authMiddleware` valida o token em cada rota protegida.
6. Token expirado ou inválido retorna `401` e redireciona para `/login`.

**Credenciais padrão:** `admin@clinica.com` / `admin123`

## Medidas de Segurança (OWASP Top 10)

| Medida | Implementação |
|--------|---------------|
| Broken Access Control | Middleware JWT em todas as rotas protegidas |
| Cryptographic Failures | bcrypt (12 rounds) para senhas; JWT com segredo em env |
| Injection | express-validator + express-mongo-sanitize; queries parametrizadas (pg) |
| Insecure Design | Rate limiting (100 req/15min geral, 20 req/15min login) |
| Security Misconfiguration | Helmet headers; CORS restrito; sem stack trace em produção |
| Vulnerable Components | Versões estáveis e compatíveis verificadas |
| Authentication Failures | Rate limit no login; mensagens genéricas de erro |
| Software Integrity | Docker multi-stage builds |
| Logging Failures | Logs de erro centralizados no errorHandler |
| SSRF | Sem redirecionamento de URLs externas |

## Variáveis de Ambiente

Copie `.env.example` para `.env` na raiz do projeto:

```bash
cp .env.example .env
```

| Variável | Descrição |
|----------|-----------|
| `POSTGRES_USER` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `POSTGRES_DB` | Nome do banco PostgreSQL |
| `MONGODB_URI` | URI de conexão MongoDB |
| `JWT_SECRET` | Segredo para assinatura JWT |
| `JWT_EXPIRES_IN` | Tempo de expiração do token |
| `CORS_ORIGIN` | Origem permitida pelo CORS |
| `VITE_API_URL` | URL base da API (frontend) |

## Como Executar

### Com Docker (recomendado)

```bash
docker compose up --build
```

Serviços disponíveis:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3000/api
- **Swagger:** http://localhost:3000/api/docs

### Desenvolvimento Local

1. Suba PostgreSQL e MongoDB (via Docker ou instalação local).
2. Configure `.env` nos diretórios `backend/` e `frontend/`.
3. Backend:
   ```bash
   cd backend && npm install && npm run dev
   ```
4. Frontend:
   ```bash
   cd frontend && npm install && npm run dev
   ```

## Testes

### Backend

Os testes utilizam **pg-mem** (PostgreSQL em memória) e **mongodb-memory-server** (MongoDB em memória), não sendo necessário Docker para executá-los:

```bash
cd backend
npm install
npm test
```

Para testes de integração com bancos reais, suba os containers de teste:

```bash
docker compose -f docker-compose.test.yml up -d
cd backend && npm test
```

### Frontend

```bash
cd frontend
npm install
npm test
```

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/auth/me` | Verificar token | Sim |
| GET/POST/PUT/DELETE | `/api/users` | CRUD usuários | Sim |
| GET/POST/PUT/DELETE | `/api/doctors` | CRUD médicos | Sim |
| GET/POST/PUT/DELETE | `/api/specialties` | CRUD especialidades | Sim |
| GET/POST/PUT/DELETE | `/api/appointments` | CRUD consultas | Sim |
| GET | `/api/dashboard/stats` | Estatísticas | Sim |
| GET | `/api/health` | Health check | Não |

Documentação completa disponível em `/api/docs` (Swagger UI).

## Rotas do Frontend

| Rota | Descrição |
|------|-----------|
| `/login` | Tela de autenticação |
| `/dashboard` | Indicadores resumidos |
| `/users` | Gestão de usuários |
| `/doctors` | Gestão de médicos |
| `/specialties` | Gestão de especialidades |
| `/appointments` | Gestão de consultas |

## Licença

Projeto acadêmico — uso educacional.
