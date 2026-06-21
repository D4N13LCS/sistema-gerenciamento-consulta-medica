# ClínicaMed — Sistema de Gestão de Clínicas Médicas

Aplicação full stack profissional para gerenciamento de clínicas médicas, incluindo prontuário eletrônico de pacientes, agendamento de consultas, gestão de médicos e especialidades, com autenticação JWT, interface administrativa responsiva e containerização via Docker.

## Visão Geral

O ClínicaMed é um sistema completo de gestão de clínicas médicas que oferece:

- **Prontuário Eletrônico de Pacientes** com estrutura rica incluindo dados pessoais, histórico médico detalhado, anamnese completa e histórico de exames estruturado
- **Gestão de Consultas** com agendamento, acompanhamento e histórico
- **Gestão de Médicos e Especialidades** com validação de CRM e múltiplas especialidades por médico
- **Timeline do Paciente** para visualização cronológica de eventos
- **Interface Administrativa** moderna e responsiva
- **Autenticação JWT** segura com proteção de rotas
- **API RESTful** documentada com Swagger

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
                                               │ Appointments, │
                                               │ Patients      │
                                               └──────────────┘
```

### Backend (Node.js + Express)

| Camada | Responsabilidade |
|--------|------------------|
| `controllers/` | Recebe requisições e retorna respostas HTTP |
| `services/` | Regras de negócio e lógica de domínio |
| `models/` | Acesso a dados (PostgreSQL e MongoDB) |
| `routes/` | Definição de rotas e documentação Swagger |
| `middlewares/` | Autenticação JWT, validação, tratamento de erros |
| `validators/` | Validação e sanitização de entradas |
| `config/` | Conexões de banco e Swagger |

### Frontend (React + Vite)

| Camada | Responsabilidade |
|--------|------------------|
| `pages/` | Telas da aplicação (Dashboard, Patients, Doctors, etc.) |
| `components/` | Componentes reutilizáveis (Table, Modal, Button, Card, Timeline...) |
| `layouts/` | Layout do painel administrativo |
| `contexts/` | AuthContext e ToastContext |
| `services/` | Comunicação HTTP centralizada via Axios |
| `routes/` | Rotas protegidas e públicas |
| `utils/` | Helpers de autenticação e formatação |

## Tecnologias

### Backend
- **Node.js 20** + **Express 4**
- **PostgreSQL 16** — usuários (CRUD relacional)
- **MongoDB 7** — médicos, especialidades, consultas e pacientes (CRUD NoSQL)
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

## Estrutura de Diretórios

```
fab-p2-6periodo/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (banco, Swagger)
│   │   ├── controllers/      # Controladores HTTP
│   │   ├── middlewares/     # Middlewares (auth, validação)
│   │   ├── models/
│   │   │   ├── mongo/       # Modelos MongoDB (Patient, Doctor, etc.)
│   │   │   └── postgres/    # Modelos PostgreSQL (User)
│   │   ├── routes/          # Definição de rotas
│   │   ├── services/        # Serviços de negócio
│   │   ├── utils/           # Utilitários (validators)
│   │   └── validators/      # Validadores de entrada
│   ├── tests/               # Testes de integração
│   ├── migrations/          # Scripts de migração SQL
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # Contextos React
│   │   ├── layouts/         # Layouts da aplicação
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── routes/          # Rotas React Router
│   │   ├── services/        # Serviços HTTP
│   │   └── utils/           # Utilitários
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Autenticação JWT

1. O usuário envia `POST /api/auth/login` com e-mail e senha.
2. O backend valida credenciais (bcrypt) e retorna um token JWT.
3. O frontend armazena o token em `localStorage`.
4. Todas as requisições protegidas incluem `Authorization: Bearer <token>`.
5. O middleware `authMiddleware` valida o token em cada rota protegida.
6. Token expirado ou inválido retorna `401` e redireciona para `/login`.

**Credenciais padrão:** `admin@test.com` / `admin123`

## Medidas de Segurança (OWASP Top 10)

| Medida | Implementação |
|--------|---------------|
| Broken Access Control | Middleware JWT em todas as rotas protegidas; proteção de exclusão de admin por role |
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

## Funcionalidades Implementadas

### Módulo de Pacientes (Prontuário Eletrônico)

O módulo de pacientes foi completamente reestruturado para funcionar como um prontuário eletrônico profissional:

- **Dados Pessoais**: Nome, data de nascimento, CPF, telefone, email, endereço
- **Histórico Médico**: Doenças pré-existentes, alergias, medicamentos em uso, cirurgias anteriores, histórico familiar, comorbidades
- **Anamnese**: Queixa principal, história da doença atual, hábitos de vida, fatores de risco, observações clínicas
- **Histórico de Exames Estruturado**: Cada exame possui nome, data, resultado e observações
- **Observações Gerais**: Campo livre para informações complementares
- **Timeline do Paciente**: Visualização cronológica de eventos (cadastro, consultas, exames, atualizações)
- **Página de Detalhes**: Tela dedicada para visualização completa do prontuário
- **Integração com Consultas**: Exibição de consultas relacionadas ao paciente

### Validações Implementadas

- **CPF**: Validação de formato e dígito verificador
- **CRM**: Validação de formato de CRM médico brasileiro
- **Telefone**: Validação de formato de telefone brasileiro (DDD + número)
- **Email**: Validação de formato de e-mail
- **Data de Nascimento**: Validação de formato ISO8601 e verificação de não ser futura
- **Especialidades**: Mínimo de 1 especialidade por médico
- **Unicidade**: CPF e email únicos por paciente; CRM único por médico

### Gestão de Usuários

- CRUD completo de usuários
- Proteção de exclusão de usuários admin (baseada em role, não ID fixo)
- Compatibilidade com bancos de dados com e sem coluna `role`

### Gestão de Consultas

- Agendamento de consultas com validação de paciente, médico e especialidade
- Verificação de que a especialidade pertence ao médico
- Status de consulta: agendada, realizada, cancelada
- Integração com prontuário do paciente

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| GET | `/api` | Informações da API | Não |
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/auth/me` | Verificar token | Sim |
| GET/POST/PUT/DELETE | `/api/users` | CRUD usuários | Sim |
| GET/POST/PUT/DELETE | `/api/doctors` | CRUD médicos | Sim |
| GET/POST/PUT/DELETE | `/api/specialties` | CRUD especialidades | Sim |
| GET/POST/PUT/DELETE | `/api/patients` | CRUD pacientes | Sim |
| POST/PUT/DELETE | `/api/patients/:id/exams` | Gerenciar exames do paciente | Sim |
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
| `/patients` | Gestão de pacientes (listagem) |
| `/patients/:id` | Detalhes do paciente (prontuário) |
| `/appointments` | Gestão de consultas |

## Migrações de Banco de Dados

Para ambientes de produção que não possuem a coluna `role` na tabela `users`, execute o script de migração:

```bash
psql -U postgres -d clinica_med -f backend/migrations/add_role_column.sql
```

O script adiciona a coluna `role` com valor padrão 'user' e atualiza o usuário admin (id=1) para 'admin'.

## Melhorias Recentes

- **Reestruturação completa do prontuário de pacientes** com campos estruturados para histórico médico e anamnese
- **Histórico de exames estruturado** em vez de campo de texto livre
- **Timeline do paciente** para visualização cronológica de eventos
- **Página de detalhes do paciente** dedicada para visualização do prontuário
- **Melhoria da interface do formulário de pacientes** com seções organizadas
- **Melhoria da navegação** com ação de visualização separada de edição
- **Integração pacientes-consultas** na tela de detalhes
- **Endpoint GET /api** com informações da API
- **Proteção de exclusão de admin baseada em role** em vez de ID fixo
- **Compatibilidade com bancos sem coluna role** através de fallback queries

## Licença

Projeto acadêmico — uso educacional.
