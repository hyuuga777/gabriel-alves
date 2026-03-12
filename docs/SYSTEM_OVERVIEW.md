# Visão Geral do Sistema - Plataforma SaaS de Fitness (Team Alves)

Este documento descreve a arquitetura geral, funcionalidades e a organização da plataforma SaaS de Fitness projetada para gestão de alunos, prescrição de treinos e acompanhamento de evoluções.

---

## 1. Visão Geral da Arquitetura e Stack

A plataforma é um **Software as a Service (SaaS)** voltado para profissionais de educação física (Treinadores) que gerenciam diversos Alunos, cobrando por planos de assinatura.

### Stack Tecnológico
- **Frontend/Backend:** Next.js (App Router), React 19
- **Estilização:** Tailwind CSS v4, Framer Motion (para animações/Glassmorphism)
- **Banco de Dados:** PostgreSQL hospedado no Supabase
- **ORM:** Prisma
- **Autenticação:** NextAuth.js
- **Pagamentos:** Integração com Mercado Pago
- **Validação de Dados:** Zod + React Hook Form

---

## 2. Modelagem de Dados e Domínios do Sistema

O banco de dados é estruturado (via Prisma) em vários domínios essenciais:

### 2.1 Usuários e Perfil
- **Tipos de Usuário (Roles):** `ALUNO`, `TREINADOR`, e `ADMIN`.
- **Anamnese (AlunoProfile):** Armazena peso, altura, restrições médicas, histórico de saúde, nível de atividade e metas do aluno, bem como flags de conclusão do onboarding.

### 2.2 Assinaturas e Financeiro
- **Planos:** Definição de produtos (Mensal, Trimestral, Anual), com recursos, descontos, flags de destaque e preços.
- **Assinaturas:** O vínculo do aluno com o plano escolhido e o status da assinatura (`ATIVA`, `CANCELADA`, `SUSPENSA`, `EXPIRADA`).
- **Pagamentos:** Rastreia cada fatura consolidada e seu estado aprovado/pendente/rejeitado, vinculado ao ID transacional do Mercado Pago.
- **Checkout:** Formulário detalhado com coleta de dados pessoais, **endereço completo** e integração do método de pagamento. 

### 2.3 Treinos e Exercícios
- **Base de Exercícios:** Catálogo interno informando grupo muscular, equipamento, vídeos, e instruções.
- **Treinos:** Agrupamentos de treinos (ex: Ficha A, B, C, ABCD).
- **Atribuição de Treino:** Define para qual aluno a rotina se aplica e em quais dias da semana.
- **Logs de Treino (Tracking):** Permite ao aluno registrar a conclusão de cada exercício indicando a carga usada, RPE (esforço percebido) e observações, com métricas históricas de progressão.

### 2.4 Avaliação Física e Progresso
Sistema complexo de métricas físicas para acompanhar resultados de forma científica:
- **Composição Corporal:** Peso, dobras cutâneas (via protocolo Jackson & Pollock, em migração para o padrão específico da Team Alves), testes de perímetros (braços, pernas, abdômen) e Bioimpedância.
- **Avaliação Funcional:** Checklist de mobilidade, cálculo de assimetrias, avaliação postural e encurtamentos.
- **Performance:** Medição de VO2 Máx via Teste de Cooper, controle de Força Máxima (1RM).
- **Fotos de Avaliação:** Histórico de fotos de Frente, Costas e Laterais associados as datas de avaliação.

### 2.5 Comunicação Interna
- **Chat:** Sistema de troca de mensagens privadas bidirecional direto pela plataforma, com suporte para leitura e envio de anexos.
- **Notificações:** Alertas do sistema referentes a vencimento de faturas, novos treinos atribuídos e lembretes logados.

---

## 3. Painel Administrativo (`/admin`)

Direcionado aos Treinadores (Profissionais de Educação Física) e gestores do negócio, permitindo gerenciar o cerne financeiro e profissional. 

### Estrutura de Funcionalidades:
- **Dashboard (`/admin/painel`):** Tela inicial com o resumo gerencial: total de alunos ativos, faturamento, alertas e atalhos rápidos.
- **Alunos (`/admin/alunos`):** Listagem, filtros e gestão de todos os perfis dos alunos cadastrados.
- **Planos (`/admin/planos`):** Cadastro e customização da grade de planos vendidos na página de checkout da ferramenta.
- **Financeiro (`/admin/financeiro`):** Fluxo de caixa de assinaturas via Mercado Pago, verificação de pagamentos, gráficos de receita, status de inadimplência e renovações.
- **Exercícios (`/admin/exercicios`):** Administração do catálogo/biblioteca de exercícios suportados pela plataforma.
- **Programas/Treinos (`/admin/programas`):** Criação das fichas (A, B, C, etc), determinação de volume, intensidades, cadências e repetições.
- **Evolução (`/admin/evolucao`):** Lançamento de novas avaliações físicas para os alunos e visualização comparativa de medidas, fórmulas (VO2 Max, % Gordura) e fotos do progresso do aluno.
- **Chat (`/admin/chat`):** Área de atendimento para o treinador responder perguntas, tirar dúvidas e engajar com a carteira de alunos.
- **Configurações (`/admin/config`):** Definições gerais da conta do treinador e sistema.

---

## 4. Painel do Aluno (`/aluno`)

Direcionado aos clientes finais (quem compra e treina) com foco em UX gamificada, uso facilitado via mobile e acompanhamento do próprio corpo.

### Estrutura de Funcionalidades:
- **Dashboard (`/aluno/dashboard`):** Portal de entrada mostrando o treino do dia atual, atalhos rápidos, notificações não lidas e um gráfico básico da última evolução.
- **Treinos (`/aluno/treinos`):** 
  - Visualização de toda a planilha de rotina (Ficha A, B, C).
  - Execução de Treino: Interface onde o aluno marca *checkboxes* de exercícios finalizados, insere as cargas exatas que levantou e as notas daquele dia, salvando os `Logs de Treino`.
- **Evolução (`/aluno/evolucao`):** Onde o aluno confere as fotos antes/depois, percebe numericamente a queda do percentual de gordura ou aumento do VO2 e revisa de forma clara todo seu histórico estético e fisiológico.
- **Pagamentos (`/aluno/pagamentos`):** Controle da própria assinatura do aluno. Faturas disponíveis, histórico de parcelas pagas, e opção de upgrade/downgrade de plano.
- **Chat (`/aluno/chat`):** Canal de comunicação direto com o suporte/treinador focado na remoção de fricções; lugar de tirar dúvidas do exercício.
- **Perfil (`/aluno/perfil`):** Seção para mudar dados cadastrais e senha.

---

## 5. Regras de Negócios Pendentes ou em Especificação

No contexto da Team Alves (`FORMULAS_TEAM_ALVES.md`), o sistema suporta de forma científica diversos testes padrão.
Existe um passo ativo no Roadmap de **ajustar as fórmulas científicas padrão** pelas metodologias puras utilizadas no protocolo próprio do contratante, os quais envolvem atualizar o algoritmo do *Assessment Engine* baseado nos cálculos avançados de Dobras Cutâneas, Classificações de Assimetria e Ficha Funcional exclusivos da Team Alves.
