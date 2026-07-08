# Plano de commits – saas-clinic

Execute na ordem (a partir da raiz do repo). Use `git status` entre os blocos para confirmar.

---

## 1. docs: documentação do projeto
```bash
git add FUNCIONALIDADES.md ROTAS.md prisma/README.md
git commit -m "docs: add features, routes and prisma readme"
```

## 2. chore: dependências e chaves
```bash
git add package.json pnpm-lock.yaml
git add private.pem public.pem
git commit -m "chore: update deps and add JWT keys"
```

## 3. chore: prisma – schema, migrations e seeds
```bash
git add prisma/schema.prisma
git add prisma/migrations/
git add prisma/helpers/
git add prisma/seed.ts
git add prisma/seeds/
git commit -m "chore(prisma): schema, migrations and seeds"
```

## 4. feat: transações e repositórios base
```bash
git add src/domain/application/transactions/
git add src/infra/database/prisma-transaction-manager.ts
git add src/infra/database/database.module.ts
git commit -m "feat: transaction manager and database module"
```

## 5. feat: value objects e entidades
```bash
git add src/domain/enterprise/value-objects/cnpj.ts
git add src/domain/enterprise/value-objects/appointment-status.ts
git add src/domain/enterprise/entities/clinic.ts
git add src/domain/enterprise/entities/patient.ts
git add src/domain/enterprise/entities/professional.ts
git add src/domain/enterprise/events/
git commit -m "feat(domain): value objects, entities and events"
```

## 6. feat: erros compartilhados
```bash
git add src/shared/errors/
git commit -m "feat(shared): domain and app errors"
```

## 7. feat: repositórios e mappers Prisma
```bash
git add src/domain/application/repositories/
git add src/infra/database/prisma/mappers/
git add src/infra/database/prisma/repositories/
git commit -m "feat(infra): repositories and prisma mappers"
```

## 8. feat: use cases – clinic, franchise, users
```bash
git add src/domain/application/use-cases/clinic/
git add src/domain/application/use-cases/users/
git add src/domain/application/use-cases/franchise/
git add src/domain/application/use-cases/anamnesis/
git commit -m "feat(use-cases): clinic, franchise, users and anamnesis"
```

## 9. feat: use cases – patient e professional
```bash
git add src/domain/application/use-cases/patient/
git add src/domain/application/use-cases/professional/
git commit -m "feat(use-cases): patient and professional"
```

## 10. feat: use cases – procedure e appointment
```bash
git add src/domain/application/use-cases/procedure/
git add src/domain/application/use-cases/appointment/
git commit -m "feat(use-cases): procedure and appointment"
```

## 11. feat: auth e apresentação
```bash
git add src/infra/auth/
git add src/infra/cryptography/
git add src/infra/http/presenters/
git add src/infra/http/decorators/
git commit -m "feat(infra): auth, crypto and http presenters/decorators"
```

## 12. feat: controllers – users, clinic, franchise, mfa
```bash
git add src/infra/http/controlers/users/
git add src/infra/http/controlers/clinic/
git add src/infra/http/controlers/franchise/
git add src/infra/http/controlers/mfa/
git commit -m "feat(controllers): users, clinic, franchise and mfa"
```

## 13. feat: controllers – patient, professional, procedure
```bash
git add src/infra/http/controlers/patient/
git add src/infra/http/controlers/professional/
git add src/infra/http/controlers/procedure/
git commit -m "feat(controllers): patient, professional and procedure"
```

## 14. feat: controllers – appointment e anamnesis
```bash
git add src/infra/http/controlers/appointment/
git add src/infra/http/controlers/anamnesis/
git add src/infra/http/http.module.ts
git commit -m "feat(controllers): appointment and anamnesis, register in http module"
```

## 15. feat: change password (backend)
```bash
git add src/domain/application/repositories/password-verification-repository.ts
git add src/domain/application/use-cases/users/change-password.ts
git add src/domain/enterprise/entities/password-verification.ts
git add src/infra/database/prisma/repositories/prisma-password-verification-repository.ts
git add src/infra/http/controlers/users/change-password.controller.ts
git add src/shared/errors/password-token-expired-error.ts
git add src/shared/errors/password-verification-not-found-error.ts
git add prisma/migrations/20260220120744_add_password_verification/
git commit -m "feat(auth): change password use case and controller"
```

## 16. chore: email, events e main
```bash
git add src/infra/email/
git add src/infra/events/
git add src/main.ts
git add src/app.module.ts
git commit -m "chore: email, events and app bootstrap"
```

## 17. test: factories e in-memory repos
```bash
git add test/
git commit -m "test: update factories and in-memory repositories"
```

---

Se sobrar arquivo, use `git status` e faça um commit final tipo `chore: misc` com o restante.
