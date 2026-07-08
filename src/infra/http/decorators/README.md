# HTTP Decorators

Este diretório contém decorators customizados para facilitar o acesso a dados da requisição HTTP.

## @Tenant()

Extrai o tenant (clinic slug) da requisição. Suporta duas formas de envio:

1. **Header**: `X-Tenant-ID: clinica-principal`
2. **Query Parameter**: `?tenant=clinica-principal`

### Uso

```typescript
import { Tenant } from '@/infra/http/decorators/tenant.decorator';

@Get()
async handle(@Tenant() clinicSlug: string) {
  // clinicSlug será o slug da clínica
  // Exemplo: "clinica-principal"
}
```

### Exemplos de Requisições

**Com Header:**
```bash
curl -H "X-Tenant-ID: clinica-principal" \
     http://localhost:3000/users/authenticate
```

**Com Query Parameter:**
```bash
curl "http://localhost:3000/users/authenticate?tenant=clinica-principal"
```

### Validação

O decorator retorna `undefined` se o tenant não for fornecido. É recomendado validar no controller:

```typescript
async handle(@Tenant() clinicSlug: string) {
  if (!clinicSlug) {
    throw new BadRequestException(
      'Tenant (clinic slug) is required. Provide it via X-Tenant-ID header or ?tenant= query parameter.'
    );
  }
  // ... resto do código
}
```

## @Fingerprint()

Extrai informações de fingerprint do cliente (IP e User-Agent).

### Uso

```typescript
import { Fingerprint } from '@/infra/http/decorators/fingerprint.decorator';

@Post()
async handle(@Fingerprint() fingerprint: Fingerprint) {
  // fingerprint.ip - IP do cliente
  // fingerprint.userAgent - User-Agent do cliente
}
```

