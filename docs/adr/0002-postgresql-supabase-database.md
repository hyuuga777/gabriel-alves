# ADR-0002: PostgreSQL via Supabase como Banco de Dados

## Status

✅ Aceito

## Data

Março 2026

## Contexto

A plataforma gerencia dados altamente relacionais e sensíveis:

- Relacionamentos complexos: `User → AlunoProfile → Avaliacao → FotoAvaliacao → ExercicioLog`
- Dados de saúde (dobras cutâneas, VO2 Max, histórico médico) — exigem ACID compliance
- Transações financeiras (assinaturas, pagamentos) — requerem consistência garantida
- Queries temporais complexas (evolução física nos últimos 3/6/12 meses)
- Multi-tenancy: dados de múltiplos alunos e treinadores isolados

O time precisava de um banco gerenciado (managed service) para evitar overhead de administração de banco em produção (backups, replicação, fail-over).

## Opcões Consideradas

### Opção 1: PostgreSQL via Supabase ✅ ESCOLHIDA
- **Prós:** ACID compliance total, relações complexas nativas, JSONB para dados flexíveis, managed service com backups automáticos, autenticação integrada (opcional), free tier generoso, `pgvector` disponível para futuras features de IA, painel visual de dados incluído.
- **Contras:** Vendor lock-in leve (pode migrar para PostgreSQL puro), starter tier com apenas 500MB.

### Opção 2: MongoDB Atlas
- **Prós:** Schema flexível, fácil para dados JSON aninhados.
- **Contras:** Transações multi-documento complexas e com overhead, modelagem de dados relacionais antinatural, ausência de joins nativos penaliza queries de evolução temporal.

### Opção 3: PlanetScale (MySQL)
- **Prós:** Boa escalabilidade, branching de schema.
- **Contras:** Foreign keys desabilitadas por padrão (branching de schema), menos capaz para queries analíticas complexas, sem suporte a `JSONB`.

### Opção 4: Firebase Firestore
- **Prós:** Tempo real nativo, SDK mobile.
- **Contras:** Sem queries relacionais, custo por leitura explode com o crescimento, muito difícil de modelar relações complexas como a plataforma exige.

## Decisão

Adotar **PostgreSQL hospedado no Supabase** como banco de dados principal.

## Justificativa

1. **ACID para dados financeiros e de saúde:** Transações de pagamento e registros de saúde não podem ter inconsistências. PostgreSQL garante atomicidade.

2. **Relações naturais:** O modelo de dados tem 7 domínios com relacionamentos M:N complexos (`ExercicioTreino`, `AtribuicaoTreino`). SQL com joins é mais expressivo e performático que queries em NoSQL para esse padrão.

3. **Managed service:** Supabase cuida de backups automáticos, replicação, monitoramento e SSL sem configuração adicional — crítico para um time pequeno.

4. **JSONB para flexibilidade:** Campos de configurações e metadados não-estruturados (ex: parâmetros de avaliação customizados da Team Alves) podem usar `JSONB` sem criar tabelas extras.

5. **Custo e escala progressiva:** Free tier suporta o MVP. Upgrade para Pro ($25/mês) quando necessário.

## Consequências

### Positivas
- Consistência garantida para dados financeiros e médicos
- Queries de evolução temporal com índices compostos eficientes
- Supabase Dashboard como BI básico sem custo
- Backups automáticos diários incluídos

### Negativas
- Starter tier limita a 500MB de storage e 100 conexões simultâneas
- Subida para Pro necessária ao atingir ~500 usuários ativos

### Riscos ativos ⚠️

- **Índices faltando:** `ExercicioLog.treinoLogId` sem índice pode causar full table scan com 5M+ registros.
  - **Mitigação:** Adicionar `@@index([treinoLogId])` e `@@index([alunoId, data])` no schema Prisma antes de atingir 1k usuários.

- **Multi-tenancy implícita:** Não há `treinadorId` em todas as tabelas, risco de query retornar dados de outro treinador.
  - **Mitigação:** Ver ADR-0006.

## Notas de Implementação

```prisma
// Índices recomendados a adicionar:
model ExercicioLog {
  @@index([treinoLogId])
  @@index([alunoId, createdAt]) // para queries de evolução
}

model Avaliacao {
  @@index([alunoId, createdAt]) // para comparações temporais
}
```

## Referências

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
- [docs/TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md — Seção 4.1](../TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md)
