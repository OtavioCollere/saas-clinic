# SaaS Clinic - Backend API

Sistema SaaS completo para gestão de **pequenas e médias clínicas de estética**. Plataforma backend construída com arquitetura limpa (Clean Architecture) e Domain-Driven Design (DDD), oferecendo funcionalidades completas para gerenciamento de clínicas, franquias, pacientes, profissionais, agendamentos, procedimentos e anamneses.

> **Nota:** Este projeto foi desenvolvido como exercício de aprendizado e prática, com o objetivo de aplicar e consolidar conhecimentos sobre arquitetura de software, padrões de design e tecnologias modernas que são utilizadas em projetos profissionais.

## Sobre o SaaS Clinic

O **SaaS Clinic** é uma plataforma completa de gestão desenvolvida especificamente para **pequenas e médias clínicas de estética**. O sistema oferece todas as ferramentas necessárias para administrar o dia a dia de uma clínica, desde o cadastro de pacientes até o controle de agendamentos e procedimentos realizados.

### Público-Alvo

- **Pequenas clínicas de estética** (1-5 profissionais)
- **Médias clínicas de estética** (6-20 profissionais)
- **Redes de franquias** de clínicas de estética
- **Profissionais autônomos** que precisam de gestão profissional

### Funcionalidades Principais

#### Gestão de Clínicas e Franquias
- Cadastro e gerenciamento de clínicas
- Sistema de franquias (múltiplas unidades)
- Ativação/desativação de clínicas e franquias
- Controle de membros e papéis (roles)

#### Gestão de Pacientes
- Cadastro completo de pacientes
- Histórico de atendimentos
- Anamneses detalhadas (histórico médico, condições de saúde, histórico estético, avaliação física)
- Busca e filtros avançados

#### Gestão de Profissionais
- Cadastro de profissionais por franquia
- Vinculação com conselhos profissionais (CRM, CRO, etc.)
- Controle de especialidades e profissões

#### Agendamentos
- Sistema completo de agendamentos
- Controle de status (aguardando, confirmado, cancelado, concluído)
- Agendamentos por paciente e profissional
- Itens de agendamento (múltiplos procedimentos por agendamento)

#### Procedimentos
- Cadastro de procedimentos por franquia
- Controle de preços e descrições
- Ativação/desativação de procedimentos
- Busca e listagem

#### Anamneses
- Anamnese completa por paciente
- Histórico médico
- Condições de saúde
- Histórico estético
- Avaliação física

## Visão Geral Técnica

Sistema backend modular focado em segurança, escalabilidade e manutenibilidade. A arquitetura separa responsabilidades em camadas bem definidas, facilitando testes, manutenção e evolução do código.

**Stack Principal:**
- **Runtime:** Node.js com TypeScript
- **Framework:** NestJS 11 com Fastify
- **Validação:** Zod
- **Autenticação:** JWT com algoritmo RS256
- **Banco de Dados:** PostgreSQL com Prisma ORM
- **Cache/Queue:** Redis (ioredis) com BullMQ
- **Email:** Nodemailer (com BullMQ para processamento assíncrono)
- **Logging:** Pino (nestjs-pino) com logs estruturados
- **Rate Limiting:** Token Bucket algorithm com Redis (Lua script)
- **Testes:** Vitest
- **Linting/Formatting:** Biome

## Objetivos do Negócio

1. **Gestão Completa:** Sistema unificado para todas as necessidades de uma clínica de estética
2. **Multi-tenant:** Suporte a múltiplas clínicas e franquias na mesma plataforma
3. **Escalabilidade:** Preparado para crescer com a clínica, de pequena a média porte
4. **Facilidade de Uso:** API intuitiva e bem documentada
5. **Conformidade:** Controle de dados sensíveis e histórico médico completo

## Objetivos Técnicos

1. **Segurança:** Implementação de autenticação robusta com MFA, gerenciamento de sessões e validação de fingerprint
2. **Manutenibilidade:** Arquitetura modular que facilita adição de features e manutenção
3. **Testabilidade:** Separação de responsabilidades que permite testes unitários e E2E isolados
4. **Escalabilidade:** Estrutura preparada para crescimento horizontal e processamento assíncrono
5. **Documentação:** API documentada via Swagger/OpenAPI

## Decisões Arquiteturais

### Clean Architecture + DDD

O projeto segue os princípios de Clean Architecture com separação em três camadas principais:

- **Domain Layer (`src/domain`)**: Contém as regras de negócio puras, entidades, value objects e interfaces de repositórios. Esta camada não depende de frameworks ou bibliotecas externas.
- **Application Layer (`src/domain/application`)**: Contém os casos de uso (use cases) que orquestram a lógica de negócio. Depende apenas da camada de domínio.
- **Infrastructure Layer (`src/infra`)**: Implementações concretas de repositórios, serviços externos, HTTP controllers e integrações. Depende das camadas de domínio e aplicação.

**Trade-off:** A separação rigorosa aumenta a complexidade inicial, mas reduz acoplamento e facilita testes e manutenção a longo prazo.

### JWT com RS256

Utilizamos JWT assinado com algoritmo RS256 (RSA com SHA-256) ao invés de HS256. Isso permite:

- **Segurança:** A chave privada fica apenas no servidor; a chave pública pode ser distribuída para validação
- **Escalabilidade:** Múltiplos serviços podem validar tokens sem compartilhar segredos
- **Rotação de chaves:** Facilita rotação de chaves sem invalidar todos os tokens

**Trade-off:** RS256 é computacionalmente mais custoso que HS256, mas o ganho em segurança e escalabilidade justifica o overhead.

### Fastify ao invés de Express

Fastify foi escolhido por performance superior e melhor suporte a TypeScript nativo. 

### Validação com Zod

Zod fornece validação em runtime com inferência de tipos TypeScript. Isso garante que dados validados em runtime correspondem aos tipos em compile-time.

### Rate Limiting com Token Bucket

Implementação de rate limiting usando o algoritmo Token Bucket com Redis:

- **Algoritmo:** Token Bucket (permite bursts controlados)
- **Implementação:** Script Lua no Redis para operações atômicas
- **Performance:** Operações atômicas garantem consistência sem locks
- **Escopo:** Por IP do cliente
- **Configuração:** Flexível via decorator `@RateLimit()`

**Trade-off:** Requer Redis em execução, mas oferece alta performance e consistência distribuída.

### Logging Estruturado com Pino

Sistema de logging otimizado para performance:

- **Biblioteca:** Pino (via nestjs-pino)
- **Performance:** Ultra-rápido, mínimo overhead (~5% mais lento que console.log)
- **Formato:** JSON estruturado em produção, legível em desenvolvimento
- **Integração:** Automática com NestJS, captura contexto de requests

**Trade-off:** JSON estruturado é menos legível para humanos, mas facilita parsing e análise automatizada.

## Arquitetura do Sistema

### Estrutura de Diretórios

```
src/
├── shared/                  # Código compartilhado entre camadas
│   ├── entities/            # Entidades base
│   ├── errors/              # Erros de domínio
│   ├── either/              # Functional error handling
│   ├── types/               # Tipos utilitários
│   ├── guards/              # Guards reutilizáveis
│   ├── decorators/          # Decorators customizados
│   └── filters/             # Filtros globais
├── domain/                  # Camada de domínio
│   ├── enterprise/          # Entidades e value objects
│   ├── application/         # Casos de uso
│   │   ├── use-cases/       # Implementação dos casos de uso
│   │   ├── repositories/    # Interfaces de repositórios
│   │   └── cryptography/    # Interfaces de criptografia
│   └── services/           # Serviços de domínio
└── infra/                   # Camada de infraestrutura
    ├── auth/                # Implementação de autenticação
    ├── cryptography/        # Implementação de criptografia
    ├── database/            # Prisma e configuração de DB
    ├── email/               # Serviço de email (Nodemailer + BullMQ)
    ├── env/                 # Validação de variáveis de ambiente
    ├── http/                # Controllers e presenters
    ├── observability/       # Logging e monitoramento
    ├── rate-limit/          # Rate limiting (Token Bucket)
    └── cache/               # Cache com Redis
```

### Fluxo de Dados

1. **Request** → Controller (HTTP layer)
2. **Controller** → Use Case (Application layer)
3. **Use Case** → Repository Interface (Domain layer)
4. **Repository Implementation** → Database (Infrastructure layer)
5. **Response** ← Use Case → Controller → HTTP Response

### Princípios de Design

- **Dependency Inversion:** Camadas superiores definem interfaces; camadas inferiores implementam
- **Single Responsibility:** Cada classe/arquivo tem uma responsabilidade única
- **Open/Closed:** Extensível via interfaces, fechado para modificação
- **Either Pattern:** Tratamento funcional de erros sem exceções para erros de domínio

## Segurança e Autenticação

### Autenticação JWT

- **Algoritmo:** RS256 (RSA com SHA-256)
- **Chaves:** Par de chaves RSA (pública/privada) em Base64 nas variáveis de ambiente
- **Tokens:**
  - **Access Token:** Expira em 15 minutos
  - **Refresh Token:** Expira em 7 dias
- **Validação:** Passport.js com estratégia JWT customizada

### Gerenciamento de Sessões

O sistema implementa gerenciamento de sessões baseado em fingerprint do cliente:

- **Fingerprint:** Combinação de IP e User-Agent
- **Estados de Sessão:**
  - `PENDING`: Aguardando verificação MFA
  - `ACTIVE`: Sessão ativa e autenticada
  - `REVOKED`: Sessão revogada (logout ou nova sessão)
  - `EXPIRED`: Sessão expirada por tempo

**Comportamento:**
- Sessões com mesmo fingerprint são reutilizadas
- Novas sessões com fingerprint diferente revogam sessões ativas anteriores
- Sessões expiram após 30 dias de inatividade

### Multi-Factor Authentication (MFA)

Implementação de MFA via TOTP (Time-based One-Time Password):

- **Setup:** Gera secret TOTP e códigos de backup
- **Enable:** Ativação após validação de código TOTP
- **Verify Login:** Verificação obrigatória durante autenticação se MFA estiver habilitado

**Fluxo:**
1. Usuário faz login → recebe `session_id` se MFA estiver habilitado
2. Usuário envia código TOTP com `session_id`
3. Sistema valida código e ativa sessão
4. Tokens JWT são gerados e retornados

### Verificação de Email

- **Token:** Gerado aleatoriamente (32 bytes hex)
- **Expiração:** 1 hora
- **Comportamento:** Tokens antigos são invalidados ao gerar novo token
- **Envio:** Assíncrono via BullMQ com Nodemailer como provider SMTP

### Validação de Dados

- **Runtime:** Zod schemas validam todos os inputs
- **Compile-time:** Inferência de tipos TypeScript a partir dos schemas
- **HTTP:** Validação via pipes do NestJS antes de chegar aos controllers

### Rate Limiting

Implementação de rate limiting usando o algoritmo **Token Bucket**:

- **Algoritmo:** Token Bucket
- **Implementação:** Redis com script Lua para operações atômicas
- **Escopo:** Por IP do cliente
- **Configuração:** Via decorator `@RateLimit()` em controllers ou rotas
- **Guard Global:** Aplicado automaticamente via `APP_GUARD`

**Exemplo de uso:**
```typescript
@RateLimit({ capacity: 5, refillRate: 1 })
@Controller('/users')
export class AuthenticateUserController {
  // ...
}
```

**Características:**
- Operações atômicas via Lua script no Redis
- Configuração flexível por rota/controller
- Resposta HTTP 429 (Too Many Requests) quando excedido
- Recarga automática de tokens baseada em taxa configurada

### Logging e Observabilidade

Sistema de logging estruturado com **Pino**:

- **Biblioteca:** nestjs-pino (integração Pino com NestJS)
- **Formato:** JSON estruturado em produção
- **Desenvolvimento:** pino-pretty para logs coloridos e legíveis
- **Performance:** Ultra-rápido, mínimo overhead
- **Contexto:** Metadata automática de request/response
- **Filtros:** HttpExceptionFilter global para captura de erros

**Características:**
- Logs estruturados facilitam parsing e análise
- Níveis de log: info, error, warn, debug
- Contexto rico com método HTTP, URL, status, etc.
- Tratamento global de exceções com logging automático

## Fluxos Principais

### Autenticação

```
1. POST /users/authenticate
   - Valida credenciais (email + password)
   - Verifica sessões ativas por fingerprint
   - Cria ou reutiliza sessão
   - Se MFA habilitado: retorna session_id
   - Se MFA não habilitado: retorna access_token + refresh_token

2. POST /users/mfa/verify-login (se MFA habilitado)
   - Valida código TOTP
   - Ativa sessão
   - Retorna access_token + refresh_token
```

### Registro de Usuário

```
1. POST /users/register-user
   - Valida dados de entrada
   - Hash de senha com bcrypt
   - Cria usuário no banco
   - Gera token de verificação de email
   - Envia email de verificação (síncrono)
   - Retorna usuário criado
```

### Verificação de Email

```
1. GET /email-verification/verify?token=xxx
   - Valida token
   - Verifica expiração
   - Marca email como verificado
   - Invalida token usado
```

## Estrutura do Projeto

### Casos de Uso (Use Cases)

Cada caso de uso é uma classe isolada que:
- Recebe uma requisição tipada
- Executa lógica de negócio
- Retorna `Either<Error, Success>`
- Não depende de frameworks ou HTTP

Exemplo:
```typescript
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    // ...
  ) {}

  async execute(request: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    // Lógica de negócio pura
  }
}
```

### Repositórios

Interfaces definidas na camada de domínio, implementadas na infraestrutura:

```typescript
// Domain layer
export abstract class UsersRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}

// Infrastructure layer
export class PrismaUsersRepository implements UsersRepository {
  // Implementação com Prisma
}
```

### Error Handling

Erros de domínio são classes que estendem `DomainError`:

```typescript
export class WrongCredentialsError extends DomainError {
  constructor() {
    super('Invalid credentials');
  }
}
```

Controllers convertem erros de domínio em exceções HTTP apropriadas.

## Testes

### Testes Unitários

Testes unitários focam em casos de uso isolados, utilizando repositórios e serviços em memória:

- **Framework:** Vitest
- **Cobertura:** Foco em casos de uso e lógica de negócio
- **Mocks:** Repositórios in-memory para isolamento

**Estrutura:**
```
src/domain/application/use-cases/
  └── users/
      └── __unit__/
          └── authenticate-user.spec.ts
```

**Padrão de Testes:**
- **Happy Path:** Testa o fluxo de sucesso
- **Sad Path:** Testa casos de erro e validações
- **Arrange-Act-Assert:** Estrutura clara e organizada
- **In-Memory Repositories:** Isolamento completo de dependências externas
- **Fake Services:** Mocks para serviços de criptografia, hash, etc.

### Testes E2E

Testes end-to-end validam fluxos completos através da API HTTP:

- **Framework:** Vitest + Supertest
- **Escopo:** Fluxos críticos de autenticação e autorização
- **Status:** Planejado (não implementado)

**Comando:**
```bash
npm run test:e2e
```

## Documentação da API

A API é documentada via Swagger/OpenAPI e está disponível em:

```
http://localhost:3000/api
```

**Endpoints Documentados:**
- Autenticação e autorização
- Gerenciamento de usuários
- Operações de clínicas, franquias e profissionais
- Health checks

## Configuração e Execução Local

### Pré-requisitos

- Node.js 18+ 
- PostgreSQL 16+
- Redis (para rate limiting e futuras filas)

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sass_clinic"

# JWT
JWT_PUBLIC_KEY="<chave pública RSA em Base64>"
JWT_PRIVATE_KEY="<chave privada RSA em Base64>"
JWT_SECRET="<fallback, não usado com RS256>"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="<fallback>"
JWT_REFRESH_EXPIRATION="7d"

# Email (configuração SMTP)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="password"
EMAIL_FROM="noreply@example.com"
EMAIL_VERIFY_URL="http://localhost:3000/email-verification/verify"

# Redis (para BullMQ e Rate Limiting)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""  # Opcional
REDIS_DATABASE=""  # Opcional

# Server
PORT=3000
```

### Geração de Chaves RSA

```bash
# Gerar par de chaves
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem

# Converter para Base64
base64 -i private.pem
base64 -i public.pem
```

### Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma migrate dev

# Executar em desenvolvimento
npm run start:dev
```

### Docker Compose

Para ambiente local completo:

```bash
docker-compose up -d
```

Isso inicia:
- PostgreSQL na porta 5432
- PgAdmin na porta 5050

**Nota:** Redis não está configurado no docker-compose atual. Para funcionalidades de rate limiting e filas de email, é necessário ter Redis em execução. Você pode:
- Instalar Redis localmente
- Usar Docker: `docker run -d -p 6379:6379 redis:alpine`
- Usar um serviço gerenciado (Redis Cloud, AWS ElastiCache, etc.)

### Scripts Disponíveis

```bash
npm run start:dev      # Desenvolvimento com hot-reload
npm run build          # Build para produção
npm run start:prod     # Executar build de produção
npm test               # Executar testes unitários
npm run test:watch     # Testes em modo watch
npm run test:cov       # Testes com cobertura
npm run lint           # Linter (Biome)
npm run format         # Formatação (Biome)
```

## Deploy

### Build de Produção

```bash
npm run build
npm run start:prod
```

### Considerações de Deploy

- **Variáveis de Ambiente:** Todas as variáveis devem estar configuradas no ambiente de produção
- **Chaves RSA:** Gerar par de chaves específico para produção
- **Database Migrations:** Executar migrations antes do deploy
- **Health Checks:** Endpoint `/health` disponível para monitoramento

**Plataformas Consideradas:**
- Google Cloud Run
- AWS ECS/Fargate
- Kubernetes

## Roadmap

### Implementado ✅

- [x] Autenticação JWT com RS256
- [x] Gerenciamento de sessões com fingerprint
- [x] MFA (TOTP)
- [x] Verificação de email
- [x] Email assíncrono com BullMQ e Nodemailer
- [x] Validação de dados com Zod
- [x] Testes unitários
- [x] Documentação Swagger
- [x] **Rate Limiting:** Token Bucket completo com Redis e Lua script
- [x] **Logging:** Pino com logs estruturados e pino-pretty em dev
- [x] **Observabilidade:** HttpExceptionFilter global para tratamento de erros

### Planejado 🚧

- [ ] **Testes E2E:** Cobertura de fluxos críticos
- [ ] **Observabilidade Avançada:**
  - [ ] Métricas (Prometheus)
  - [ ] Tracing distribuído (OpenTelemetry)
  - [ ] Dashboard de monitoramento
- [ ] **Deploy:**
  - [ ] Configuração para Cloud Run
  - [ ] CI/CD pipeline
  - [ ] Secrets management

### Futuro 🔮

- [ ] Refresh token rotation
- [ ] Device management
- [ ] Audit logs

## Limitações Conhecidas

1. **Testes E2E:** Não implementados. Cobertura atual apenas unitária.
2. **Observabilidade:** Logging estruturado implementado. Métricas e tracing não implementados.
3. **Rate Limiting:** Requer Redis em execução. Sem Redis, o guard não funciona corretamente.






