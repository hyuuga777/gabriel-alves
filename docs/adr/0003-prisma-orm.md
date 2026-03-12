# ADR-0003: Prisma como ORM e Gerenciador de Migrations

## Status

✅ Aceito

## Data

Março 2026

## Contexto

Com PostgreSQL como banco de dados e TypeScript como linguagem, a equipe precisava de uma forma de:

1. **Definir o schema** do banco de forma declarativa e versionada
2. **Executar migrations** com segurança (rollback, auditoria de mudanças)
3. **Fazer queries** ao banco de forma type-safe — sem `any` nos resultados
4. **Gerar tipos TypeScript** automaticamente a partir do schema do banco

O modelo de dados é complexo (7 domínios, 15+ tabelas, múltiplas relações M:N), então a escolha do ORM impacta diretamente a produtividade e a segurança dos dados.

## Opções Consideradas

### Opção 1: Prisma ✅ ESCOLHIDA
- **Prós:** Schema declarativo (`schema.prisma` é fonte de verdade), migrations automáticas com `prisma migrate`, client 100% tipado gerado automaticamente, `Prisma Studio` como UI de dados, excelente integração com Next.js e Supabase, auto-complete perfeito em IDE.
- **Contras:** Overhead de geração do client (`prisma generate`), queries muito complexas às vezes precisam de `$queryRaw`, não suporta todas as features avançadas do PostgreSQL nativamente.

### Opção 2: Drizzle ORM
- **Prós:** Mais próximo de SQL puro, performance excelente, sem geração de código.
- **Contras:** Schema em TypeScript puro (mais verboso que Prisma SDL), migrations menos maduras à época, menor comunidade de exemplos e templates.

### Opção 3: TypeORM
- **Prós:** Mature, bem documentado, suporte a decorators.
- **Contras:** Configuração mais complexa, problemas de performance conhecidos com relations, tipos menos precisos que Prisma.

### Opção 4: Knex.js (Query Builder puro)
- **Prós:** Controle total das queries.
- **Contras:** Sem tipos automáticos, sem migrations declarativas, mais boilerplate.

## Decisão

Adotar **Prisma 6+** como ORM única solução — schema source of truth, migrations versionadas e client tipado.

## Justificativa

1. **Schema como documentação:** O arquivo `schema.prisma` serve simultaneamente como definição de banco e documentação viva do modelo de dados. Qualquer dev lê e entende as entidades.

2. **Migrations seguras:** `prisma migrate dev` gera SQL de migration automaticamente a partir das mudanças no schema e cria um histórico auditável em `prisma/migrations/`.

3. **Type safety completa:** O Prisma Client gerado garante que toda query retorna tipos exatos. `Prisma.UserGetPayload<...>` permite inferir tipos complexos com includes.

4. **Produtividade:** Auto-complete em IDE mostra campos disponíveis, relações, e filtragem. Sem erros de digitação em nomes de tabela/campo.

5. **Prisma Studio:** Painel visual para inspecionar e editar dados durante desenvolvimento — substitui parcialmente a necessidade de psql ou Supabase Dashboard.

## Consequências

### Positivas
- `schema.prisma` é a fonte de verdade única para o banco — sem schema drift
- Migrations versionadas permitem rollback controlado
- Zero erros de tipo em queries ao banco em runtime
- Onboarding de novos devs mais rápido (schema autoexplicativo)

### Negativas
- `prisma generate` precisa rodar após mudanças no schema (processo adicional em CI)
- Queries muito otimizadas (ex: CTEs, window functions) exigem `$queryRaw` saindo do ecossistema tipado
- `PrismaClient` instanciado múltiplas vezes em desenvolvimento (resolver com singleton)

### Notas de Implementação

```typescript
// ✅ Singleton obrigatório em Next.js (evitar múltiplas conexões em dev)
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Referências

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma com Next.js Best Practices](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [schema.prisma do projeto](../../prisma/schema.prisma)
