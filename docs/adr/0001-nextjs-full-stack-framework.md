# ADR-0001: Next.js como Framework Full-Stack

## Status

✅ Aceito

## Data

Março 2026

## Contexto

A plataforma Team Alves SaaS de Fitness precisava de um framework para construir uma aplicação web que serve dois perfis distintos:

- **Painel Administrativo** (`/admin`): Treinadores gerenciam alunos, treinos e financeiro — uso majoritariamente desktop, operações CRUD complexas.
- **Painel do Aluno** (`/aluno`): Alunos acompanham treinos e evolução — uso majoritariamente mobile, exige UX rápida e fluida.

O time é pequeno (1-3 desenvolvedores) e precisava de uma solução que unificasse frontend e backend sem a complexidade de manter dois repositórios separados e dois runtimes distintos (ex: React SPA + Express API).

### Requisitos principais:
- SSR/SSG para SEO na landing page de captação
- API Routes integradas (sem servidor Node.js separado)
- TypeScript end-to-end
- Bom suporte a deploy em Vercel (provedor alvo)
- React como biblioteca de UI (familiaridade do time)

## Decisores

- Time de desenvolvimento (Team Alves)

## Opções Consideradas

### Opção 1: Next.js 14+ (App Router) ✅ ESCOLHIDA
- **Prós:** Framework completo (SSR, SSG, API Routes, RSC), App Router com Server Components reduz JS no client, excelente performance, deploy trivial na Vercel, TypeScript nativo, ecossistema React maduro, Turbopack acelera dev.
- **Contras:** App Router ainda relativamente novo (curva de aprendizado com Server Components vs Client Components), bundle pode ser grande se mal configurado.

### Opção 2: Remix
- **Prós:** Formulários nativos, boa integração com banco de dados, sem JS necessário em muitos casos.
- **Contras:** Menor adoção que Next.js, ecossistema menor, menos templates/starters disponíveis.

### Opção 3: React SPA (Vite) + Express API separado
- **Prós:** Separação clara de responsabilidades.
- **Contras:** Dois repositórios, dois deploys, dois ambientes, maior complexidade operacional para um time pequeno.

### Opção 4: SvelteKit
- **Prós:** Performance excelente, código mais enxuto.
- **Contras:** Time não tem familiaridade, menor ecossistema de componentes.

## Decisão

Adotar **Next.js 16+ com App Router** como framework full-stack unificado.

## Justificativa

1. **Unificação do stack:** Frontend e backend no mesmo codebase em TypeScript. Time pequeno se beneficia de compartilhar tipos, funções utilitárias e lógica sem cruzar fronteiras de repositório.

2. **React Server Components:** Reduz drasticamente o JavaScript enviado ao browser para páginas que não precisam de interatividade (ex: dashboard estático, listagens), melhorando o tempo de carregamento — especialmente crítico no painel do aluno via mobile.

3. **API Routes integradas:** Endpoints `/api/*` no mesmo servidor. Sem latência de rede entre UI e API (tudo na mesma Vercel function ou servidor Node).

4. **SEO na Landing Page:** `generateMetadata` e SSG nativo permitem que a página de captação (`/`, `/planos`) seja indexável por crawlers sem configuração adicional.

5. **Deploy na Vercel:** Integração perfeita, preview deployments automáticos em PRs, edge functions disponíveis, sem custo adicional de configurar CI/CD.

## Consequências

### Positivas
- Time usa uma única linguagem (TypeScript) do banco à UI.
- Deploy simplificado: um `git push` publica frontend e backend.
- Performance de carregamento superior em páginas SSR/RSC.
- Tipos compartilhados entre servidor e cliente eliminam erros de contrato.

### Negativas
- Curva de aprendizado com Server Components e o novo paradigma do App Router.
- Cuidado necessário ao marcar corretamente componentes como `'use client'` vs padrão server.
- Testes de Server Components exigem abordagem diferente dos testes tradicionais de React.

### Riscos
- **Risco:** Next.js versões major podem trazer breaking changes significativos.
  - **Mitigação:** Versão pinada no `package.json`, atualizar apenas com teste completo.

## Notas de Implementação

- Usar `loading.tsx` e `error.tsx` em cada segmento de rota para UX adequada.
- Server Actions para mutations (formulários) em vez de API Routes quando possível.
- `Suspense` para streaming de dados pesados (ex: gráficos de evolução).

## Referências

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [React Server Components RFC](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [docs/TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md](../TECHNOLOGY_STACK_AND_CAPACITY_ANALYSIS.md)
