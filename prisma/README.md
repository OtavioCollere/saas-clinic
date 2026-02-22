# Database Seeders

Sistema de seeders modular para popular o banco de dados com dados iniciais.

## Estrutura

```
prisma/
├── seed.ts                 # Arquivo principal de seed
├── helpers/
│   └── hash-password.ts   # Helper para hash de senhas
└── seeds/
    ├── users.seed.ts      # Seed de usuários
    ├── franchises.seed.ts # Seed de franquias (preparado para futuro)
    └── professionals.seed.ts # Seed de profissionais (preparado para futuro)
```

## Como usar

### Executar seed

```bash
pnpm seed
```

ou

```bash
pnpm prisma db seed
```

### Executar seed específico

Os seeds são modulares e podem ser importados individualmente. Para adicionar um novo seed:

1. Crie o arquivo em `prisma/seeds/nome.seed.ts`
2. Exporte uma função async que recebe `PrismaClient`
3. Importe e chame no `seed.ts`

## Dados padrão

### Usuários

- **Owner**: `owner@clinic.com` / `123456`
- **Member**: `member@clinic.com` / `123456`

Todos os usuários têm email verificado por padrão.

## Boas práticas

- ✅ Sempre use `upsert` para evitar duplicação
- ✅ Use helpers para operações comuns (ex: hash de senha)
- ✅ Mantenha seeds modulares e reutilizáveis
- ✅ Documente dados padrão criados
- ✅ Trate erros adequadamente

## Adicionando novos seeds

Exemplo de seed:

```typescript
import { PrismaClient } from '@prisma/client';

export async function seedNome(prisma: PrismaClient) {
  console.log('📦 Seeding nome...');

  const item = await prisma.model.upsert({
    where: { uniqueField: 'value' },
    update: {},
    create: {
      // campos...
    },
  });

  console.log(`✅ Created/updated 1 item`);
  return item;
}
```

E no `seed.ts`:

```typescript
import { seedNome } from './seeds/nome.seed';

async function main() {
  await seedNome(prisma);
}
```




