# Análise Tecnológica e Capacidade da Plataforma SaaS de Fitness

**Data:** Março 2026  
**Plataforma:** Team Alves - SaaS de Gestão de Fitness  
**Status:** MVP/Produto em Evolução

---

## 1. Stack Tecnológico Completo

### 1.1 Tecnologias Principais

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|----------|
| **Frontend** | Next.js (App Router) | 16.1.0 | Framework full-stack SSR/SSG |
| **Frontend** | React | 19.2.3 | Biblioteca de UI component-based |
| **Estilização** | Tailwind CSS | v4 | Utility-first CSS framework |
| **Backend** | Next.js (API Routes) | 16.1.0 | API REST nativa |
| **Autenticação** | NextAuth.js | 5.0.0-beta.30 | Gerenciamento de sessões e autenticação |
| **ORM** | Prisma | 6.0.0 | Object-Relational Mapping + Migrations |
| **Banco de Dados** | PostgreSQL | (Supabase) | RDBMS relacional, escalável |
| **Validação** | Zod | 4.2.1 | Schema validation (end-to-end type safety) |
| **Formulários** | React Hook Form | 7.69.0 | Gerenciamento efficient de forms |
| **Gráficos** | Recharts | 3.6.0 | Visualização de dados (evolução física) |
| **Animações** | Framer Motion | 12.23.26 | Glassmorphism e transições fluidas |
| **Ícones** | Lucide React | 0.562.0 | Biblioteca de ícones SVG |
| **Pagamentos** | Mercado Pago SDK | 2.11.0 | Integração com gateway de pagamentos |
| **Segurança** | bcryptjs | 3.0.3 | Hash de senhas |
| **Utilitários** | date-fns | 4.1.0 | Manipulação de datas |
| **TypeScript** | TypeScript | 5 | Type-safety para todo o codebase |

### 1.2 Infraestrutura & Hospedagem

- **Banco de Dados:** PostgreSQL no Supabase (managed service)
- **Hospedagem:** Compatível com Vercel, Netlify, ou qualquer servidor Node.js
- **Autenticação:** JWT-based (via NextAuth.js + Prisma Adapter)
- **Gateway de Pagamentos:** Mercado Pago (latam)
- **CDN & Storage:** Suporte a URL externa de imagens configurável

---

## 2. Arquitetura de Dados

### 2.1 Estrutura do Modelo de Dados

A plataforma utiliza **7 domínios principais** no banco de dados:

#### **Domínio 1: Usuários & Autenticação**
- `User` (central): 19 campos
- `AlunoProfile`: Dados biométricos e história clínica do aluno
- Roles: `ALUNO`, `TREINADOR`, `ADMIN`

**Relações:** 1 usuário → até 40 vinculos (treinos, logs, mensagens, avaliações)

#### **Domínio 2: Assinaturas & Pagamentos**
- `Assinatura`: Link usuário ↔ Plano
- `Plano`: Catálogo de produtos (3-5 planos típicos)
- `Pagamento`: Histórico de transações (Mercado Pago)

**Complexidade:** Suporta múltiplos ciclos de vida (ATIVA, SUSPENSA, EXPIRADA, CANCELADA)

#### **Domínio 3: Exercícios & Treinos**
- `Exercicio`: Catálogo (~100-500 exercícios padrão)
- `Treino`: Fichas de treino (A, B, C, ABCD)
- `ExercicioTreino`: Relacionamento M:M com metadados (séries, reps, descanso)
- `AtribuicaoTreino`: Vinculação aluno ↔ treino por dias da semana

**Cardinalidade:** 1 treino contém 8-15 exercícios | 1 aluno pode ter 1-4 treinos simultâneos

#### **Domínio 4: Logs de Treino (Telemetria)**
- `TreinoLog`: Sessão de treino do dia
- `ExercicioLog`: Cada exercício executado (carga, reps, RPE, notas)

**Volume:** ~500 logs/mês por aluno ativo (20-25 treinos/mês × 15-25 exercícios)

#### **Domínio 5: Avaliação Física & Progresso**
- `Avaliacao`: Snapshot scientific de métricas corporais
  - Composição: peso, bioimpedância, dobras cutâneas (7 pontos), perímetros (6 pontos)
  - Funcional: mobilidade, encurtamentos, postura, assimetrias
  - Performance: VO2 Max (Cooper), força máxima, potência
- `FotoAvaliacao`: Histórico fotográfico (frente, costas, laterais)

**Cálculos:** Percentual de gordura, VO2, METS, gasto calórico (via Assessment Engine)

#### **Domínio 6: Comunicação**
- `Mensagem`: Chat bidirecional com anexos
- `Notificacao`: Alertas de sistema (treinos, pagamentos, avaliações)

**Índices:** Otimizados para queries de leitura (remetente, destinatário, status lido)

#### **Domínio 7: Web Pages & Checkout**
- Atualmente hardcoded em componentes (Planos, Checkout)
- Possibilidade de abstração futura em modelo de Landing Pages

### 2.2 Diagrama de Relacionamentos Principais

```
User (Aluno)
  ├── AlunoProfile (1:1) → Dados biométricos
  ├── Assinatura (1:1) → Plano
  │   └── Pagamento (1:N) → Transações Mercado Pago
  ├── AtribuicaoTreino (1:N) → Treino
  │   └── Treino (1:N) → ExercicioTreino
  │       └── Exercicio → Catálogo de exercícios
  ├── TreinoLog (1:N) → Cada treino realizado
  │   └── ExercicioLog (1:N) → Cada exercício do treino
  ├── Avaliacao (1:N) → Avaliações físicas
  │   └── FotoAvaliacao (1:N) → Fotos de frente/costas/lateral
  └── Mensagens (1:N) → Chat com treinador/suporte
```

---

## 3. Análise de Complexidade

### 3.1 Score de Complexidade: **7.5/10 (MODERADAMENTE COMPLEXA)**

#### O que torna a plataforma complexa:

1. **Domínios Científicos** ⚠️ **Alto**
   - Cálculos biomecânicos (Jackson & Pollock, VO2 Max, METS)
   - Análise de composição corporal múltiplas metodologias
   - Assessment Engine customizado (Team Alves)
   - Requer validação clínica e conformidade

2. **Telemetria & Rastreamento** ⚠️ **Médio-Alto**
   - 500+ registros/aluno/mês de logs de treino
   - Índices nas tabelas críticas (mensagens, notificações)
   - Queries complexas de evolução temporal
   - Potencial gargalo: `ExercicioLog` sem index em `treinoLogId`

3. **Relacionamentos multi-tenancy (Treinador → Alunos)** ⚠️ **Médio-Alto**
   - Cada treinador gerencia múltiplos alunos
   - Separação de dados por tenant implícita (via User.id)
   - Sem isolamento explícito no banco de dados
   - **Risco:** Query incorreta pode vazar dados entre alunos/treinadores

4. **Integração de Pagamentos** ⚠️ **Médio**
   - Fluxo de estado complexo (PENDING → APPROVED → ACTIVE/SUSPENDED)
   - Webhooks do Mercado Pago precisam idempotência
   - Reconciliação de transações não implementada

5. **Autenticação & Autorização** ⚠️ **Médio**
   - NextAuth.js com Prisma Adapter (bem estabelecido)
   - 3 roles (ALUNO, TREINADOR, ADMIN)
   - Falta segregação explícita por tenant em routes

#### O que tornam-a menos complexa:

✅ **Stack uniificado:** Next.js todo-em-um (frontend + backend)  
✅ **TypeScript:** Type safety desde o banco até a UI  
✅ **Prisma:** ORM abstraiu complexidade SQL  
✅ **Validação de schema:** Zod fornece contrato claro  
✅ **Sem microserviços:** Monolítica simplifica deployment  

---

## 4. Capacidade de Usuários com infraestrutura atual

### 4.1 Estimativa de Capacidade por Componente

#### **Banco de Dados PostgreSQL (Supabase)**

| Métrica | Capacidade-padrão | Observações |
|---------|------------------|-------------|
| **Conexões simultâneas** | 100-500 (dep. plano) | Supabase starter: 100 |
| **Armazenamento** | Até 8GB (starter) / 100GB+ (pro) | Varia conforme plano |
| **Queries/segundo** | ~1000-5000 | Dep. indexação e query complexity |
| **Tamanho de tupla média** | User: 300 bytes, ExercicioLog: 200 bytes | Compactível |

**Cálculo de Capacidade de Usuários (Banco):**
- **Usuários únicos:** 5.000-50.000 (conforme plano Supabase)
- **Cargas de leitura:** Suporta as 50k com otimizações
- **Cargas de escrita:** Mais limitadas (~500 escritas/segundo simultâneas)

#### **Next.js Server (compute)**

| Métrica | Capacidade | Observações |
|---------|-----------|-------------|
| **Req/segundo** | 500-2000 req/s (por instância) | Vercel auto-scales |
| **Memória por request** | ~50-100 MB (full-stack) | Depende de processamento |
| **Conexões DB** | Prisma pool: ~10-20 | Supabase pode exigir upgr. |
| **Uploads** | Dependente de CDN | Atualmente mockado |

**Cálculo de Capacidade (Compute):**
- **Usuários simultâneos:** 500-1.000 (com 1-2 instâncias)
- **Requisições concorrentes:** ~2.000-4.000 Req/s (auto-scaling)
- **Sessões JWT:** Stateless, ilimitadas

#### **Aplicação Frontend (browser)**

| Métrica | Capacidade | Notas |
|---------|-----------|-------|
| **Tamanho de bundle** | ~150-200 KB (gzip) | Otimizado com code-splitting |
| **Renderização** | React Server Components reduzem JS | Bom para performance |
| **Requisições paralelas** | ~6 (limite browser) | HTTP/2 mitiga |

---

### 4.2 Cenários de Uso & Capacidade Real

#### **Cenário 1: Uso Modesto (PME - 1 Treinador, 50 Alunos)**

```
- 50 alunos ativos simultâneos: ✅ SEM PROBLEMAS
- Peak hours: 50 usuários online, 5-10 executando treino = 10 escritas/s
- DB: 0.1% da capacidade
- Vercel Hobby: Suficiente (com free tier)
- Custo mensal: ~$50-100
```

**Restrições:** Nenhuma crítica. Tudo funciona bem.

---

#### **Cenário 2: Crescimento Médio (5 Treinadores, 500 Alunos)**

```
- 500 alunos registrados, 50-100 simultâneos
- Peak hours: 100 usuários, 20-30 em treino = 30-50 escritas/s
- DB: ~1-2% capacidade (indexação essencial)
- Vercel Pro: Recomendado (~$20/mês)
- Supabase Pro: Recomendado para melhor pool (~$25/mês)
- Custo mensal: ~$200-300 (infra totalmente paga)
```

**Restrições:**
- ⚠️ Índice faltando em `ExercicioLog.treinoLogId`
- ⚠️ Query de evolução temporal sem índices composite
- ⚠️ Notificações em tempo real não implementadas
- ⚠️ Mensagens sem paginação otimizada

---

#### **Cenário 3: Crescimento Agressivo (50+ Treinadores, 10.000 Alunos)**

```
- 10.000 alunos registrados, 500-1.000 simultâneos
- Peak hours: 1.000 usuários, 200-300 em treino = 300-500 escritas/s
- DB: ~10-20% capacidade (SQL bem otimizado crítico)
- Supabase Enterprise: OBRIGATÓRIO (~$500+/mês)
- Vercel Pro/Enterprise: Sim (~$20-150/mês)
- Cache Redis: Altamente recomendado (~$100/mês)
- CDN para imagens: Obrigatório (~$50-200/mês)
- Custo mensal: ~$700-1.000+
```

**Restrições Criticas:**
- ❌ Sem índices proper, queries falham em performance
- ❌ Assessment Engine não vetorizado (cálculos em loop)
- ❌ Autenticação sem rate-limiting (brute force)
- ❌ Sem background jobs (processamento síncrono)
- ❌ Sem cache de fotos de avaliação (cada download = I/O)
- ❌ Multi-tenancy implícito (vulnerável a data leaks)

---

#### **Cenário 4: Escala Massiva (1.000+ Treinadores, 100.000 Alunos)**

```
Status: ⛔ NÃO RECOMENDADO COM ARQUITETURA ATUAL
```

**Problemas fundamentais:**
1. Monolítica Next.js não suporta 10x+ crescimento sem refatoração
2. Supabase PostgreSQL atinge limites (~10M registros com queries complexas)
3. Cálculos científicos precisam serem offload (Workers/Jobs)
4. Sem estratégia de data sharding ou multi-region
5. Custo de infra explodiria (~$5k+/mês)

**Solução:** Migração para microserviços + data warehouse

---

### 4.3 Resumo de Capacidade por Plano

| Limite | Hobby | Crescimento | Escala | Enterprise |
|--------|-------|-------------|--------|-----------|
| **Usuários únicos** | 500 | 5.000 | 50.000 | 500k+ |
| **Usuários simultâneos** | 50 | 500 | 5.000 | 50k+ |
| **Req/segundo pico** | 100 | 1.000 | 10.000 | 100k+ |
| **Alunos por treinador** | ~50 | ~100 | ~200 | ~500 |
| **Custo infra/mês** | $30 | $200 | $1.000 | $5k+ |
| **Recomendado por** | MVP/Demo | StartUp | Scale-up | Enterprise |

---

## 5. Análise Crítica da Arquitetura

### 5.1 Pontos Fortes ✅

#### 1. **Type Safety End-to-End**
```
TypeScript + Zod + Prisma + React Form = 
  → Zero bugs de tipo em runtime
  → Refatoração segura
  → Auto-completar IDE perfeito
```
**Impacto:** Reduz 30-40% de bugs comuns. Excelente para manutenção.

#### 2. **Stack Unificado (JavaScript/TypeScript)**
```
Frontend React == Backend Next.js == Tipos TypeScript
  → Desenvolvimento 2x mais rápido
  → Mesmo padrão de código
  → Menos conhecimento múltiplo requerido
```
**Impacto:** Time pequeno consegue fazer tudo. Menos context-switching.

#### 3. **Arquitetura App Router (Next.js 14+)**
```
- Server Components reduzem JS enviado ao cliente
- Streaming renderiza página incrementalmente
- API Routes integradas (sem servidor separado)
- Suspense para data fetching natural
```
**Impacto:** Performance excelente, UX fluida, custo de infra reduzido.

#### 4. **Database Relationships bem modeladas**
```
User → AlunoProfile (1:1, CASCADE)
User → TreinoLog → ExercicioLog (M:N bem otimizado)
User → Avaliacao → FotoAvaliacao (M:N claro)
```
**Impacto:** Queries são natural e sem N+1 problem se usado `.include()` correto.

#### 5. **Prisma para DB Migrations**
```
schema.prisma é fonte de verdade
  → Versionamento automático
  → Rollback seguro
  → Sincronização BD com código
```
**Impacto:** Evita schema drift e manual SQL errors.

---

### 5.2 Problemas & Recomendações ⚠️

#### **CRÍTICO: Falta de Índices no Schema**

**Problema:**
```prisma
model ExercicioLog {
  treinoLogId  String  // ❌ SEM ÍNDICE
  // Query de evolução: O(n) scan completo da tabela!
}

model Mensagem {
  @@index([remetenteId, destinatarioId])  // ✅ BEM
  @@index([destinatarioId, lida])         // ✅ BEM
  // Mas sem índice em timestamps para range queries
}
```

**Impacto:** Com 10k alunos × 500 logs/mês = 5M registros. Query de "evolução últimos 3 meses" varre 1.25M rows!

**Recomendação:**
```prisma
model ExercicioLog {
  id                  String    @id @default(cuid())
  treinoLogId         String
  exercicioTreinoId   String
  
  // ✅ ADICIONAR:
  alunoId             String  // Desnormalizando para queries rápidas
  data                DateTime @default(now())
  
  @@index([treinoLogId])
  @@index([alunoId, data]) // Range queries: "últimos 3 meses por aluno"
  @@index([exercicioTreinoId, alunoId]) // Agregações por exercício
}
```

---

#### **CRÍTICO: Multi-tenancy implícita (Data Leak Risk)**

**Problema:**
```typescript
// ❌ Rota /api/admin/alunos/
const alunos = await prisma.user.findMany({
  where: { role: "ALUNO" }
  // ❌ Retorna TODOS os alunos de TODOS os treinadores!
  // Se o treinador 1 descobrir admin endpoint, acessa dados de treinador 2
})
```

**Impacto:** Vulnerabilidade crítica de segurança. Risco GDPR.

**Recomendação:**
```typescript
// ✅ Filtrar por tenant (treinador autenticado)
const session = await auth()
const alunos = await prisma.atribuicaoTreino.findMany({
  where: { 
    treino: {
      criadoPor: session.user.id  // Novo campo: User → Treino relação
    }
  },
  include: { aluno: true }
})
```

---

#### **ALTO: Assessment Engine em Python/Standalone**

**Problema:**
```javascript
// Cálculos científicos rodam síncronamente no Next.js
// VO2 Max, % Gordura, METS = loops de cálculo complexo
const percentualGordura = calcularJacksonPollock(dobras);
// Bloqueia o request até 1-2 segundos em pico
```

**Impacto:** Com 100 avaliações simultâneas = timeout (30s NextAuth timeout).

**Recomendação:**
```typescript
// ✅ Queue de background jobs:
// 1. Admin submete avaliação (rápido)
// 2. Job async calcula fórmulas (10s timeout ok)
// 3. Notificação ao aluno quando pronto

// Ferramentas: Bull Queue + Redis, ou Inngest (serverless)
```

---

#### **ALTO: Sem rate-limiting & CAPTCHA**

**Problema:**
```typescript
// POST /api/auth/register - ninguém limita!
// Brute force de login
// Spam de mensagens
// Criação de contas fake
```

**Recomendação:**
```typescript
import { Ratelimit } from "@upstash/ratelimit";

export const loginRateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 tentativas / 15 min
});

export async function POST(req: Request) {
  const { success } = await loginRateLimit.limit(email);
  if (!success) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  // ...
}
```

---

#### **MÉDIO: Sem cache de dados**

**Problema:**
```
- Exercícios: 100-500 itens, consultados 1000x/dia
- Planos: 3-5 itens, consultados 10000x/dia
- Avaliações antigas: Lidas mas nunca mudadas
→ Todo SELECT gera query ao banco
```

**Impacto:** Número de queries ao BD cresce linearmente com usuários (sem cache).

**Recomendação:**
```typescript
// Redis cache com TTL
const exercicios = await redis.get("exercicios:list");
if (!exercicios) {
  const data = await prisma.exercicio.findMany();
  await redis.setex("exercicios:list", 3600, JSON.stringify(data)); // 1 hora
  return data;
}
return JSON.parse(exercicios);
```

---

#### **MÉDIO: Sem jobs assíncronos**

**Problema:**
```
- Envio de email de confirmação: Síncrono (aguarda SMTP)
- Geração de PDFs de receita: Síncrono (aguarda pdf lib)
- Atualização de status de pagamento (webhook): Síncrono
→ Request user fica pendurado 5-10 segundos
```

**Recomendação:**
```typescript
// ✅ Queue pattern com Inngest ou Bull
await inngest.send({
  name: "email.send-receipt",
  data: { userId, pagamentoId }
});
// Request retorna imediatamente, job roda em background
```

---

#### **MÉDIO-BAIXO: Comunicação em tempo real sem WebSocket**

**Problema:**
```
Chat/Mensagens usa polling tradicional (GET a cada 3s)
Avaliações e notificações não atualizem live
```

**Recomendação (baixa prioridade):**
```typescript
// Se chegar a 500+ usuários simultâneos:
// - Socket.io ou Ably para WebSocket
// - Server-Sent Events (SSE) como fallback
// - Pusher/OneSignal para notificações push
```

---

### 5.3 Scorecard Arquitetural

| Aspecto | Score | Comentário |
|--------|-------|-----------|
| **Type Safety** | 9/10 | Excelente (TypeScript + Zod) |
| **Escalabilidade DB** | 6/10 | Bom até 50k users, índices faltam |
| **Escalabilidade Compute** | 7/10 | Next.js aguenta bem, sem bottleneck óbvio até 5k simultâneos |
| **Segurança** | 5/10 | ⚠️ Multi-tenancy implícita é vulnerabilidade, sem rate-limit |
| **Performance** | 7/10 | Boa com Server Components, assessment engine é sync |
| **Manutenibilidade** | 8/10 | Código clean, TypeScript, Prisma schema é auto-doc |
| **Testing** | 4/10 | Não há evidência de testes (unit/e2e) |
| **DevOps** | 7/10 | Supabase/Vercel são managed, deployment trivial |
| **Documentação** | 6/10 | Boa overview no SYSTEM_OVERVIEW.md, falta API docs |
| **Conformidade** | 5/10 | Suporta dados sensíveis (saúde), mas sem compliance explícita |
| **MÉDIA GERAL** | **6.4/10** | **BOM NÍVEL PARA MVP, CRÍTICO MELHORAR PARA ESCALA** |

---

## 6. Roadmap de Otimizações por Fase

### **Fase 1: Agora (MVP → 500 usuários)**
- ✅ Adicionar índices no schema Prisma
- ✅ Implementar rate-limiting em auth
- ✅ Adicionar testes (Jest + Prisma Testing)

**Esforço:** 2-3 sprints

---

### **Fase 2: Crescimento (500-5.000 usuários)**
- ✅ Refatorar multi-tenancy com tenant_id explícito
- ✅ Offload assessment engine para background jobs (Bull Queue + Redis)
- ✅ Adicionar Redis cache para exercises/plans
- ✅ Implementar data validation no Prisma (uniques, constraints)

**Esforço:** 6-8 sprints

---

### **Fase 3: Escala (5k-50k usuários)**
- ✅ Separar read replicas (Supabase pode fazer isso)
- ✅ Implementar WebSocket para mensagens real-time
- ✅ Database sharding por trainer_id
- ✅ Monitoramento & observabilidade (Datadog/Sentry)

**Esforço:** 10-12 sprints / 2.5-3 meses

---

### **Fase 4: Enterprise (50k+ usuários)**
- ✅ Migração para microserviços (Assessment Engine → worker isolado)
- ✅ Data warehouse (BigQuery/Redshift) para analytics
- ✅ CQRS pattern para escrita/leitura separadas
- ✅ GraphQL ou BFF layer

**Esforço:** Projeto de 6+ meses, múltiplos times

---

## 7. Conclusão & Recomendação Final

### **Visão Técnica: 6.4/10 - BOM PARA MVP, PRECISA EVOLUIR**

**Resumo:**
- ✅ **Stack excelente** para crescimento: Next.js + TypeScript + Prisma é production-grade
- ✅ **Banco de dados bem modelado** com bons relacionamentos
- ✅ **Developer experience** superior (type safety, unificado)
- ⚠️ **Vulnerabilidades críticas** em multi-tenancy e auth que crescem com usuários
- ⚠️ **Performance engine** precisa offloading de cálculos científicos
- ⚠️ **Faltam índices** que serão bloqueadores em 1k+ usuários

### **Recomendação Imediata:**

Antes de escalar além de 500 usuários, implemente:

1. **Índices Prisma** (1-2 días)
2. **Rate-limiting em auth** (1 día)
3. **Testes automatizados** (5-7 días)
4. **Refactor multi-tenancy** (10-15 días)

**Isso permite escalar até 10k usuários com confiança.**

---

## Apêndice: Estimativas de Custo Mensal

### Cenário 1: 500 usuários (crescimento médio)
```
Vercel Pro               $20
Supabase Pro           $25
Redis (Upstash)        $0 (free tier)
Email (Sendgrid)       $20
Domain + DNS           $12
Mercado Pago (fees)    ~2% das transações
━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                 ~$80-150/mês
```

### Cenário 2: 10k usuários (escala)
```
Vercel Pro              $100
Supabase Standard      $100
Redis (paid)           $50
Email (Sendgrid)       $50
CDN (Cloudflare)       $20
Monitoring (Sentry)    $29
Backups & DBaaS        $100
━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                 ~$450/mês
```

---

**Documento preparado em Março/2026**  
**Próxima revisão recomendada:** Quando atingir 1k usuários ativos simultâneos
