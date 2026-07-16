# ADR-0006: Estratégia de Multi-tenancy Implícita (Risco Identificado)

## Status

⚠️ Em Revisão — Aceita para MVP, porém com vulnerabilidade crítica conhecida que DEVE ser corrigida antes de escalar.

## Data

Março 2026

## Contexto

A plataforma é um **SaaS multi-tenant**: vários treinadores independentes (`TREINADOR`) gerenciam suas próprias carteiras de alunos. Os dados de alunos do Treinador A **nunca devem vazar** para o Treinador B.

Existem dois modelos clássicos de multi-tenancy em banco de dados:

1. **Banco separado por tenant** — máximo isolamento, alto custo operacional
2. **Schema separado por tenant** — bom isolamento, médio custo operacional
3. **Tabela compartilhada com `tenantId`** — menor isolamento, baixo custo, mais simples

## Decisão Atual (MVP)

A implementação atual usa **multi-tenancy implícita**: dados são separados via relacionamentos existentes, sem um campo `tenantId` (treinadorId) explícito em todas as tabelas.

A separação existe indiretamente via:
- `AtribuicaoTreino` → `treino.criadoPorId` = ID do treinador
- `Mensagem` → `remetenteId` / `destinatarioId`

**Esta abordagem foi aceita para o MVP** pelo baixo número de treinadores na fase inicial, mas **não é aceitável em produção com múltiplos treinadores**.

## Problema Identificado 🚨

```typescript
// ❌ VULNERABILIDADE ATUAL - endpoint sem filtro por treinador:
// GET /api/admin/alunos

const alunos = await prisma.user.findMany({
  where: { role: 'ALUNO' }
  // RETORNA TODOS OS ALUNOS DO SISTEMA
  // Treinador A pode acessar dados de alunos do Treinador B!
})
```

**Impacto:** Violação de privacidade, risco de LGPD, possível vazamento de dados sensíveis de saúde.

## Decisão de Correção (a implementar antes de 100 alunos)

Migrar para **multi-tenancy por `treinadorId` explícito** nas tabelas críticas:

```prisma
// schema.prisma — MUDANÇAS NECESSÁRIAS:

model Treino {
  id              String    @id @default(cuid())
  treinadorId     String    // ✅ ADICIONAR: identifica o dono do treino
  treinador       User      @relation("TreinosTreinador", fields: [treinadorId], references: [id])
  
  @@index([treinadorId]) // ✅ performance
}

model Avaliacao {
  id              String    @id @default(cuid())
  treinadorId     String    // ✅ ADICIONAR: quem registrou a avaliação
  treinador       User      @relation("AvaliacoesTreinador", fields: [treinadorId], references: [id])
  
  @@index([treinadorId, alunoId])
}
```

```typescript
// ✅ PADRÃO SEGURO para todas as queries admin:
export async function getAlunosByTreinador() {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  
  return await prisma.atribuicaoTreino.findMany({
    where: {
      treino: {
        treinadorId: session.user.id  // Filtra apenas alunos DO treinador logado
      }
    },
    include: {
      aluno: {
        select: { id: true, name: true, email: true }
      }
    }
  })
}
```

## Consequências

### Positivas (situação atual — MVP)
- Implementação mais rápida para MVP
- Schema mais simples inicialmente
- Sem custo de migration adicional no início

### Negativas / Riscos Ativos 🚨

| Risco | Severidade | Status |
|-------|-----------|--------|
| Treinador A acessa dados do Treinador B via API | **CRÍTICO** | ⚠️ Presente |
| Violação de LGPD (dados de saúde) | **CRÍTICO** | ⚠️ Presente |
| Impossibilidade de filtro por treinador em relatórios | **ALTO** | ⚠️ Presente |
| Query de "meus alunos" requer join complexo | **MÉDIO** | ⚠️ Presente |

## Plano de Correção

### Fase 1 — Correção de Emergência (antes de 50 alunos)
- [ ] Adicionar validação de `session.user.id` em TODOS os endpoints admin
- [ ] Auditar todas as rotas `/api/admin/*` e adicionar filtro por treinador
- [ ] Deploy e teste em staging

### Fase 2 — Correção Estrutural (antes de 200 alunos)
- [ ] Adicionar `treinadorId` no schema Prisma para tabelas críticas (`Treino`, `Avaliacao`, `ExercicioLog`)
- [ ] Migration de dados populando `treinadorId` dos registros existentes
- [ ] Refatorar queries para usar `treinadorId` diretamente (mais eficiente que joins)
- [ ] Adicionar índices compostos `[treinadorId, ...]`

### Fase 3 — Auditoria (antes de produção multi-tenant)
- [ ] Habilitar Row Level Security (RLS) no Supabase como camada adicional de proteção
- [ ] Implementar testes de segurança: garantir que Treinador A não acessa Treinador B

## Referências

- [LGPD — Lei Geral de Proteção de Dados](https://www.gov.br/mj/pt-br/assuntos/sua-protecao/protecao-de-dados)
- [Multi-tenancy Patterns](https://www.prisma.io/docs/guides/other/multi-tenancy)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [docs/TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md — Seção 3.1](../TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md)
