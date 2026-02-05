# SaaS Clinic – Backend API

Backend de uma plataforma **SaaS multi-tenant** para gestão de clínicas de estética, projetado com foco em **segurança, escalabilidade e qualidade arquitetural**.

Sistema estruturado para suportar **múltiplas clínicas e franquias**, com regras de negócio isoladas, processamento assíncrono, observabilidade em produção e deploy automatizado em cloud.

---

## Visão Geral



API responsável por:

- Autenticação e autorização segura
- Gestão de clínicas, franquias, usuários e profissionais
- Agendamentos com múltiplos procedimentos
- Histórico de pacientes e anamneses
- Processamento assíncrono de tarefas críticas
- Observabilidade e monitoramento em produção

Arquitetura pensada para **crescimento horizontal**, **baixo acoplamento** e **facilidade de evolução**.

---

## Stack Tecnológica

- **Backend:** Node.js, TypeScript, NestJS, Fastify
- **Dados:** PostgreSQL, Prisma ORM
- **Cache / Queue:** Redis, BullMQ
- **Segurança:** JWT (RS256), MFA (TOTP)
- **Validação:** Zod
- **Testes:** Vitest (unitários)
- **Observability:** Pino, New Relic APM
- **Infra:** Docker, AWS ECS (Fargate), ALB
- **CI/CD:** GitHub Actions

---

## Principais Habilidades Demonstradas no Projeto

### Arquitetura & Design
- Clean Architecture aplicada na prática
- Domain-Driven Design (entidades, value objects e use cases)
- Separação rigorosa entre domínio, aplicação e infraestrutura
- Dependency Inversion com interfaces de repositório

---

### Backend & APIs
- APIs REST com NestJS + Fastify
- Validação de dados com Zod (runtime + inferência de tipos)
- Tratamento funcional de erros (Either Pattern)
- Controllers finos com lógica concentrada nos casos de uso

---

### Segurança
- Autenticação JWT com algoritmo RS256
- Gerenciamento de sessões baseado em fingerprint
- MFA via TOTP
- Verificação de email com tokens expiráveis
- Rate limiting distribuído (Token Bucket)

---

### Escalabilidade & Performance
- Redis para cache, rate limiting e filas
- Processamento assíncrono com BullMQ
- Operações atômicas via Lua Script no Redis
- Estrutura preparada para crescimento horizontal

---

### Observabilidade & Produção
- Logging estruturado com Pino
- Monitoramento de performance com New Relic APM
- Health checks para Load Balancer
- Tratamento global de exceções

---

## Arquitetura da Aplicação



Separação clara de responsabilidades:

- **Domain:** regras de negócio puras
- **Application:** casos de uso
- **Infrastructure:** HTTP, banco, cache, filas e integrações externas

Essa abordagem reduz acoplamento, facilita testes e permite evolução segura do sistema.

---

## Infraestrutura e Deploy (AWS)



Deploy automatizado em ambiente cloud com:

- VPC isolada
- Subnets públicas e privadas
- Application Load Balancer
- ECS Fargate com múltiplas réplicas
- CI/CD via GitHub Actions
- Imagens Docker armazenadas no ECR

Infraestrutura preparada para **alta disponibilidade**, **isolamento de rede** e **deploy contínuo**.

---

## Testes

- Testes unitários focados em casos de uso
- Repositórios e serviços em memória
- Cobertura de fluxos críticos de domínio e autenticação

> Testes E2E planejados.

---

## Status do Projeto

- Funcionalidades principais implementadas
- Arquitetura estável e extensível
- Evolução contínua com foco em produção
