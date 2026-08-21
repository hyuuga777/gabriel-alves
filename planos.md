# Planos Estratégicos Desenvolvidos (21/08/2026)

## Plano 1: Arquitetura de Importação (Simulate-First)
- **Objetivo:** Transformar o XLSX antigo em registros persistentes de forma idempotente.
- **Decisão Arquitetural:** O Backend processa o arquivo em modo Simulação primeiro (`/api/admin/import/simulate`) e retorna um espelho dos dados. O upload final e escrita transacional só ocorre após o ok na rota (`/confirm`).
- **Segurança:** O DB nunca faz "db push" ou writes automáticas para dados colididos sem autorização da UI.

## Plano 2: Hardening V2 e Identidade Multi-Tenant
- **Objetivo:** Blindar os dados de diferentes profissionais sem cruzar ou sobrescrever históricos.
- **Decisão Arquitetural:**
  1. Criação do `importSource` (Hash composicional da ficha).
  2. Implementação das `Shadow Accounts` (Alunos sem conta real na plataforma/sem e-mail, apenas registrados para visualização do Treinador).
  3. Desacoplamento da autenticação NextAuth para lidar com `User` sem email de forma graciosa.

## Plano 3: Escopo de UI Administrativa Incremental
- **Objetivo:** Construir o Dashboard do Gabriel Alves de forma granular.
- **Etapas (7 Incrementos Mapeados):**
  - **Fase 0:** Pré-Voo e estabilização de build/Prisma (Concluído).
  - **Fase 1:** Dashboard (KPIs de alunos e faturamento).
  - **Fase 2:** Lista e Perfil Base (Tabela, buscas e visualização).
  - **Fase 3:** Avaliação Física e Evolução Histórica.
  - **Fase 4:** Contratos e Bloqueios Financeiros.
  - **Fase 5:** Métodos de Treino e Catálogo.
  - **Fase 6:** Importador Simulate-First UI (Consumindo as APIs feitas acima).
  - **Fase 7:** Auditoria Geral e Polimento de Acessibilidade (WAI-ARIA).

*Estes planos marcam a transição definitiva da modelagem backend e parsers complexos para o desenvolvimento focado na Interface do Usuário (Frontend).*
