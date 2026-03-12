# 💪 FitnessPro - Plataforma SaaS de Assessoria Esportiva

Plataforma completa de assessoria esportiva e consultoria fitness de alta performance com avaliação física profissional, treinos personalizados e acompanhamento em tempo real.

![Landing Page](https://img.shields.io/badge/Status-In%20Development-yellow)
![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748)

---

## 🎯 Visão Geral

**FitnessPro** é uma plataforma SaaS completa dividida em três pilares:

1. **Site Institucional** - Landing page de conversão premium
2. **Área do Aluno** - Dashboard funcional com treinos e progresso
3. **Painel Administrativo** - Gestão completa de alunos, treinos e avaliações

---

## ✨ Principais Funcionalidades

### 🎓 Para Alunos
- ✅ Onboarding com anamnese automática
- ✅ Treinos personalizados com vídeos
- ✅ Interface de execução com cronômetro
- ✅ Registro de carga, repetições e RPE
- ✅ Gráficos de evolução e progresso
- ✅ Chat direto com treinador
- ✅ Histórico de avaliações físicas

### 👨‍💼 Para Administradores
- ✅ Dashboard com KPIs de retenção
- ✅ CRM completo de alunos
- ✅ Biblioteca de exercícios (CRUD)
- ✅ Criação de treinos e programação
- ✅ Sistema de avaliação física profissional
- ✅ Gestão de planos e pagamentos

### 📊 Engine de Avaliação Física
- ✅ **Composição Corporal**: Bioimpedância, dobras cutâneas, perímetros
- ✅ **Avaliação Funcional**: Mobilidade, encurtamentos, postura
- ✅ **Performance**: Cooper, VO2 Max, força máxima, potência isométrica
- ✅ **Cálculos Automáticos**: % Gordura, METS, gasto calórico
- ✅ **Relatórios Comparativos**: Evolução com fotos antes/depois

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Segurança de tipos
- **TailwindCSS v4** - Estilização moderna
- **Framer Motion** - Animações fluidas
- **Recharts** - Gráficos de progresso
- **shadcn/ui** - Componentes reutilizáveis
- **Lucide React** - Ícones

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Banco de dados relacional
- **NextAuth.js** - Autenticação segura
- **Zod** - Validação de schemas

### Integrações
- **Mercado Pago** - Gateway de pagamentos
- **Cloudinary/UploadThing** - Upload de vídeos e imagens
- **Pusher/Ably** - Chat real-time (planejado)

---

## 🚀 Começando

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp env.example.txt .env
# Edite .env e preencha:
# - DATABASE_URL
# - NEXTAUTH_SECRET
# - Chaves do Mercado Pago
# - Credenciais de upload

# 3. Configure o banco de dados
npx prisma migrate dev

# 4. (Opcional) Adicione dados iniciais
npx prisma db seed

# 5. Rode o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📁 Estrutura do Projeto

```
fitness-saas/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page (COMPLETO ✅)
│   │   ├── layout.tsx
│   │   └── globals.css         # Dark mode theme (COMPLETO ✅)
│   └── lib/
│       ├── prisma.ts           # Prisma client (COMPLETO ✅)
│       ├── assessment-engine.ts # Engine de cálculos (COMPLETO ✅)
│       └── utils.ts            # Utilidades (COMPLETO ✅)
├── prisma/
│   └── schema.prisma           # Schema completo (COMPLETO ✅)
├── FORMULAS_TEAM_ALVES.md      # Referência de fórmulas
└── README.md
```

---

## 🎨 Design System

### Tema Dark Mode Premium

- **Background**: `hsl(220, 20%, 5%)` - Preto profundo
- **Primary**: `hsl(270, 80%, 60%)` - Roxo vibrante
- **Accent**: `hsl(180, 80%, 50%)` - Cyan neon
- **Glassmorphism**: Cards com blur e transparência
- **Gradientes**: Transições suaves roxo → cyan

### Componentes Customizados

```css
.glass - Efeito vidro fosco
.gradient-primary - Gradiente de fundo
.gradient-text - Texto com gradiente
.hover-lift - Elevação + sombra ao hover
.animate-in - Fade in suave
```

---

## 🗄️ Schema do Banco de Dados

### Principais Entidades

```prisma
User (id, email, name, role)
├── AlunoProfile (anamnese, objetivos)
├── Assinatura → Plano
├── TreinoLog[] (histórico)
├── Avaliacao[] (físicas)
└── Mensagem[] (chat)

Exercicio (nome, vídeo, instruções)
├── ExercicioTreino (séries, reps, carga)

Treino (template)
├── AtribuicaoTreino (aluno vinculado)

Avaliacao (composição, performance)
├── FotoAvaliacao[] (antes/depois)
```

Ver schema completo em: [prisma/schema.prisma](./prisma/schema.prisma)

---

## 📊 Engine de Avaliação Física

A plataforma inclui um motor de cálculos científicos automatizados:

### Protocolos Implementados

1. **Jackson & Pollock** (dobras cutâneas)
2. **Teste de Cooper** (VO2 Max)
3. **ACSM** (classificação condição física)
4. **Análise bilateral** (assimetrias)

### Customização TEAM ALVES

O sistema está preparado para receber fórmulas customizadas. 
Ver: [FORMULAS_TEAM_ALVES.md](./FORMULAS_TEAM_ALVES.md)

---

## 📈 Status Atual

### ✅ Concluído (Fase 1)
- [x] Setup Next.js + TypeScript
- [x] Schema Prisma completo
- [x] Design system dark mode premium
- [x] Landing page com glassmorphism + animações
- [x] Engine de avaliação física
- [x] Estrutura de utilidades

### 🔄 Próximos Passos (Fase 2)
- [ ] NextAuth.js - Autenticação
- [ ] Páginas de login/registro
- [ ] Área do aluno (dashboard)
- [ ] Painel administrativo
- [ ] Integração Mercado Pago

---

## 📚 Documentação Técnica

| Documento | Descrição |
|-----------|-----------|
| [docs/SYSTEM_OVERVIEW.md](./docs/SYSTEM_OVERVIEW.md) | Visão geral da arquitetura, funcionalidades e domínios do sistema |
| [docs/TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md](./docs/TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md) | Análise detalhada do stack, capacidade de usuários e recomendações |
| [docs/adr/](./docs/adr/) | Architecture Decision Records — registro das decisões técnicas importantes |

### Architecture Decision Records (ADRs)

| ADR | Decisão | Status |
|-----|---------|--------|
| [0001](./docs/adr/0001-nextjs-full-stack-framework.md) | Next.js como Framework Full-Stack | ✅ Aceito |
| [0002](./docs/adr/0002-postgresql-supabase-database.md) | PostgreSQL via Supabase | ✅ Aceito |
| [0003](./docs/adr/0003-prisma-orm.md) | Prisma como ORM | ✅ Aceito |
| [0004](./docs/adr/0004-mercado-pago-payment-gateway.md) | Mercado Pago como Gateway | ✅ Aceito |
| [0005](./docs/adr/0005-nextauth-authentication.md) | NextAuth.js para Autenticação | ✅ Aceito |
| [0006](./docs/adr/0006-multi-tenancy-strategy.md) | Estratégia de Multi-tenancy | ⚠️ Em Revisão |

---

## 📞 Suporte

- **Email**: contato@fitnesspro.com
- **WhatsApp**: (11) 99999-9999

---

**Feito com 💜 e ☕**
