# ADR-0005: NextAuth.js para Autenticação

## Status

✅ Aceito

## Data

Março 2026

## Contexto

A plataforma tem dois portais distintos com permissões diferentes:

- **`/admin`** — Acesso exclusivo de `TREINADOR` e `ADMIN`
- **`/aluno`** — Acesso exclusivo de `ALUNO`
- **`/`** (público) — Landing page e checkout sem autenticação

Com 3 roles (`ALUNO`, `TREINADOR`, `ADMIN`) e potencial para login social futuro (Google), a solução de autenticação precisava:
- Suporte a **credentials (email + senha)** como método principal
- **Sessões JWT** stateless (sem redis de sessão)
- Integração nativa com **Prisma** para persistir usuários e sessões no PostgreSQL
- **Middleware** de proteção de rotas no App Router do Next.js
- Suporte futuro a OAuth (Google, Apple) sem refatoração

## Opções Consideradas

### Opção 1: NextAuth.js v5 (Auth.js) ✅ ESCOLHIDA
- **Prós:** Integração nativa com Next.js App Router, Prisma Adapter oficial, suporte a credentials + OAuth, middleware `auth()` para proteção de rotas, sessão JWT ou database, bem documentado, grande comunidade.
- **Contras:** v5 ainda em beta na época da decisão, algumas APIs ainda mudando.

### Opção 2: Clerk
- **Prós:** UI pronta (formulários de login), muito fácil de configurar, suporte a org/tenant, webhooks.
- **Contras:** Custo ($25+/mês para >10k MAU), lock-in de vendor, menos controle sobre dados do usuário, dados saem do Supabase para Clerk.

### Opção 3: Supabase Auth
- **Prós:** Integrado com Supabase, Row Level Security (RLS) nativo.
- **Contras:** Requer migrar para autenticação via RLS (mudança de paradigma), documentação para uso com Prisma mais complexa, menos familiar ao time.

### Opção 4: Implementação manual (JWT + bcryptjs)
- **Prós:** Controle total.
- **Contras:** Alto risco de bugs de segurança, manutenção de sessões, refresh tokens — reinventar a roda desnecessariamente.

## Decisão

Adotar **NextAuth.js v5 (Auth.js)** com **Prisma Adapter** e **JWT strategy**.

## Justificativa

1. **Integração nativa com Next.js App Router:** O middleware `auth()` do NextAuth v5 funciona diretamente com o `middleware.ts` do App Router, protegendo rotas com uma linha.

2. **Prisma Adapter:** Persiste sessões, contas e tokens diretamente no PostgreSQL via Prisma — sem banco adicional (Redis) para sessões.

3. **JWT stateless:** Sessões JWT não requerem lookup ao banco em cada request — performance crítica para painéis com muitas re-renders.

4. **Extensível para OAuth:** Adicionar `GoogleProvider` no futuro é uma linha de configuração — sem refatoração.

5. **bcryptjs integrado:** Passwords são hasheadas com bcrypt antes de salvar — segurança por padrão.

## Consequências

### Positivas
- Proteção de rotas em um único `middleware.ts`
- Tipo `Session` compartilhado entre servidor e cliente via `useSession()`/`auth()`
- Sem custo adicional (open source)
- Dados de usuário 100% no Supabase (conformidade LGPD)

### Negativas
- v5 beta tinha algumas APIs instáveis na época da decisão
- Configuração inicial mais verbosa que Clerk
- Renovação de sessão JWT exige cuidado (expiração e refresh token)

### Implementação — Proteção de Rotas

```typescript
// middleware.ts
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isAlunoRoute = pathname.startsWith('/aluno')
  const role = req.auth?.user?.role

  if (isAdminRoute && role !== 'TREINADOR' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAlunoRoute && role !== 'ALUNO') {
    return NextResponse.redirect(new URL('/login', req.url))
  }
})

export const config = {
  matcher: ['/admin/:path*', '/aluno/:path*'],
}
```

## Referências

- [Auth.js (NextAuth v5) Documentation](https://authjs.dev)
- [Prisma Adapter for Auth.js](https://authjs.dev/getting-started/adapters/prisma)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
