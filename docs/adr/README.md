# Architecture Decision Records (ADRs)

Este diretório contém os registros de decisões arquiteturais (ADRs) da plataforma **Team Alves SaaS de Fitness**.

ADRs documentam as decisões técnicas significativas: **o que** foi decidido, **por que** e **quais as consequências**.

---

## Índice

| ADR | Título | Status | Data |
|-----|--------|--------|------|
| [0001](0001-nextjs-full-stack-framework.md) | Next.js como Framework Full-Stack | ✅ Aceito | Mar 2026 |
| [0002](0002-postgresql-supabase-database.md) | PostgreSQL via Supabase como Banco de Dados | ✅ Aceito | Mar 2026 |
| [0003](0003-prisma-orm.md) | Prisma como ORM e Gerenciador de Migrations | ✅ Aceito | Mar 2026 |
| [0004](0004-mercado-pago-payment-gateway.md) | Mercado Pago como Gateway de Pagamentos | ✅ Aceito | Mar 2026 |
| [0005](0005-nextauth-authentication.md) | NextAuth.js para Autenticação | ✅ Aceito | Mar 2026 |
| [0006](0006-multi-tenancy-strategy.md) | Estratégia de Multi-tenancy Implícita (Risco Identificado) | ⚠️ Em Revisão | Mar 2026 |

---

## Status dos ADRs

- ✅ **Aceito** — Decisão tomada e em vigor
- 🔄 **Em Revisão** — Sendo revisitada ou com ressalvas
- ⚠️ **Em Revisão** — Aceita com risco identificado e pendente de melhoria
- ❌ **Rejeitado** — Considerada mas não adotada
- 🗄️ **Obsoleto** — Substituído por outro ADR

---

## Como Criar um Novo ADR

1. Copie o template de qualquer ADR existente
2. Nomeie o arquivo: `NNNN-titulo-com-hifens.md`
3. Preencha todas as seções
4. Atualize este índice
5. Submeta para revisão do time

---

> **Princípio:** ADRs são imutáveis. Para reverter uma decisão, crie um novo ADR que a supersede.
