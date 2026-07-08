# Funcionalidades da Aplicação - SaaS Clinic

Este documento lista todas as funcionalidades implementadas na aplicação SaaS Clinic, organizadas por categoria.

## Funcionalidades de Negócio

### Gestão de Clínicas e Franquias

- Cadastro completo de clínicas
- Gerenciamento de múltiplas clínicas
- Sistema de franquias com suporte a múltiplas unidades
- Ativação e desativação de clínicas
- Ativação e desativação de franquias
- Controle de membros por clínica/franquia
- Sistema de papéis e permissões (roles)
- Multi-tenancy completo

### Gestão de Pacientes

- Cadastro completo de pacientes
- Histórico completo de atendimentos
- Busca de pacientes
- Filtros avançados para localização de pacientes
- Vinculação de pacientes a clínicas/franquias
- Controle de informações pessoais e de contato

### Gestão de Profissionais

- Cadastro de profissionais
- Vinculação de profissionais a franquias específicas
- Controle de conselhos profissionais (CRM, CRO, etc.)
- Gerenciamento de especialidades
- Controle de profissões
- Atribuição de profissionais a agendamentos

### Sistema de Agendamentos

- Criação de agendamentos
- Agendamentos vinculados a pacientes
- Agendamentos vinculados a profissionais
- Controle de status de agendamentos:
  - Aguardando confirmação
  - Confirmado
  - Cancelado
  - Concluído
- Múltiplos procedimentos por agendamento (itens de agendamento)
- Histórico completo de agendamentos

### Gestão de Procedimentos

- Cadastro de procedimentos
- Procedimentos vinculados a franquias
- Controle de preços por procedimento
- Descrições detalhadas de procedimentos
- Ativação e desativação de procedimentos
- Busca e listagem de procedimentos
- Associação de procedimentos a agendamentos

### Sistema de Anamneses

- Anamnese completa por paciente
- Histórico médico detalhado
- Registro de condições de saúde
- Histórico estético do paciente
- Avaliação física completa
- Armazenamento de informações médicas sensíveis

## Funcionalidades de Segurança e Autenticação

### Autenticação JWT

- Autenticação baseada em JWT (JSON Web Tokens)
- Algoritmo RS256 para assinatura de tokens
- Access tokens com expiração de 15 minutos
- Refresh tokens com expiração de 7 dias
- Validação automática de tokens em todas as rotas protegidas
- Rotação de tokens via refresh token

### Gerenciamento de Sessões

- Sistema de sessões baseado em fingerprint do cliente
- Fingerprint composto por IP e User-Agent
- Estados de sessão:
  - PENDING: Aguardando verificação MFA
  - ACTIVE: Sessão ativa e autenticada
  - REVOKED: Sessão revogada
  - EXPIRED: Sessão expirada
- Reutilização de sessões com mesmo fingerprint
- Revogação automática de sessões antigas ao criar nova sessão
- Expiração automática após 30 dias de inatividade

### Multi-Factor Authentication (MFA)

- Configuração de MFA via TOTP (Time-based One-Time Password)
- Geração de secret TOTP para usuários
- Geração de códigos de backup
- Ativação de MFA após validação de código
- Verificação obrigatória durante login quando MFA está habilitado
- Fluxo de autenticação em duas etapas

### Verificação de Email

- Geração de tokens de verificação de email
- Tokens com expiração de 1 hora
- Invalidação automática de tokens antigos ao gerar novo token
- Endpoint para verificação de email via token
- Marcação automática de email como verificado

### Validação de Dados

- Validação de todos os inputs em runtime
- Validação automática via pipes do NestJS
- Validação de tipos e formatos
- Mensagens de erro claras e descritivas
- Prevenção de dados inválidos na aplicação

## Funcionalidades de Infraestrutura e Performance

### Rate Limiting

- Proteção contra abuso de API
- Algoritmo Token Bucket para controle de taxa
- Operações atômicas via script Lua no Redis
- Controle por IP do cliente
- Configuração flexível por rota ou controller
- Resposta HTTP 429 (Too Many Requests) quando limite excedido
- Suporte a bursts controlados de requisições

### Processamento Assíncrono

- Sistema de filas com BullMQ
- Processamento assíncrono de emails
- Processamento em background de tarefas pesadas
- Retry automático de jobs falhos
- Monitoramento de filas

### Cache

- Sistema de cache com Redis
- Cache de dados frequentes
- Redução de carga no banco de dados
- Melhoria de performance de consultas

### Logging e Observabilidade

- Logging estruturado com Pino
- Logs em formato JSON em produção
- Logs legíveis e coloridos em desenvolvimento
- Captura automática de contexto de requests
- Níveis de log: info, error, warn, debug
- Tratamento global de exceções com logging automático
- Metadata rica com método HTTP, URL, status, etc.

### Monitoramento

- Integração com New Relic APM
- Monitoramento de performance de transações
- Rastreamento de throughput e tempo de resposta
- Rastreamento automático de erros e exceções
- Dashboard de métricas em tempo real
- Análise de dependências externas
- Métricas de negócio customizadas

## Funcionalidades de Email

### Envio de Emails

- Envio de emails via SMTP com Nodemailer
- Processamento assíncrono de emails via BullMQ
- Templates de email
- Email de verificação de conta
- Configuração flexível de provedor SMTP

## Funcionalidades de API

### Documentação

- Documentação completa via Swagger/OpenAPI
- Interface interativa para teste de endpoints
- Documentação de todos os endpoints
- Esquemas de request e response
- Exemplos de uso
- Disponível em `/api`

### Health Checks

- Endpoint de health check
- Verificação de status da aplicação
- Monitoramento de saúde do sistema
- Integração com load balancers

## Funcionalidades de Testes

### Testes Unitários

- Cobertura de casos de uso
- Testes isolados com repositórios in-memory
- Testes de happy path e sad path
- Estrutura Arrange-Act-Assert
- Mocks de serviços externos
- Framework: Vitest

## Funcionalidades de Deploy e Infraestrutura

### Deploy Automatizado

- Pipeline CI/CD com GitHub Actions
- Build automático de imagens Docker
- Push automático para Amazon ECR
- Deploy automático no Amazon ECS
- Atualização automática de task definitions
- Aguardamento de estabilidade do serviço

### Infraestrutura AWS

- Deploy no Amazon ECS Fargate
- Repositório de imagens no Amazon ECR
- VPC (Virtual Private Cloud) configurada
- Subnets públicas e privadas
- NAT Gateway para acesso à internet
- Route Tables configuradas
- Application Load Balancer (ALB)
- 3 réplicas da aplicação para alta disponibilidade
- Health checks configurados
- Logs automáticos no CloudWatch

## Funcionalidades Técnicas

### Arquitetura

- Clean Architecture implementada
- Domain-Driven Design (DDD)
- Separação em camadas: Domain, Application, Infrastructure
- Dependency Inversion Principle
- Single Responsibility Principle
- Open/Closed Principle

### Validação e Tipos

- Validação em runtime com Zod
- Inferência automática de tipos TypeScript
- Type-safety em toda a aplicação
- Validação de schemas

### Tratamento de Erros

- Padrão Either para tratamento funcional de erros
- Erros de domínio customizados
- Conversão automática de erros para HTTP status codes
- Filtros globais de exceção
- Mensagens de erro claras

### Banco de Dados

- ORM Prisma para acesso ao banco
- Migrations automáticas
- Type-safe database queries
- Suporte a PostgreSQL
- Relacionamentos complexos modelados

## Funcionalidades de Desenvolvimento

### Linting e Formatação

- Linter Biome configurado
- Formatação automática de código
- Validação de estilo de código
- Integração com editor

### Scripts de Desenvolvimento

- Hot-reload em desenvolvimento
- Build para produção
- Execução de testes
- Cobertura de testes
- Linting e formatação









