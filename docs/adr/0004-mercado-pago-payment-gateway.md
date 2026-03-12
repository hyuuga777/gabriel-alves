# ADR-0004: Mercado Pago como Gateway de Pagamentos

## Status

✅ Aceito

## Data

Março 2026

## Contexto

A plataforma é um SaaS com modelo de assinaturas recorrentes. Os alunos pagam mensalmente (ou em planos trimestrais/anuais) para acessar a plataforma. O público-alvo é **exclusivamente Brasil e América Latina**.

Requisitos do sistema de pagamentos:
- Suporte a **boleto bancário** (parcela significativa do mercado LATAM sem cartão)
- Suporte a **PIX** (método de pagamento instantâneo dominante no Brasil)
- **Cartão de crédito** com parcelamento
- Suporte a **assinaturas recorrentes** (cobrança automática mensal)
- SDK JavaScript/TypeScript disponível
- **Without checkout redirect** preferível (experiência inline)
- Conformidade com **regulações brasileiras** (CPF, endereço, dados fiscais)

## Opções Consideradas

### Opção 1: Mercado Pago ✅ ESCOLHIDA
- **Prós:** Líder de mercado no Brasil e LATAM, suporte nativo a PIX + Boleto + Cartão de crédito com parcelamento, SDK JavaScript oficialmente mantido, assinaturas recorrentes nativas, widely trusted pelos usuários brasileiros, documentação em português.
- **Contras:** Taxas mais altas que Stripe em alguns cenários, painel menos elegante, webhooks não tão rápidos quanto Stripe.

### Opção 2: Stripe
- **Prós:** API excelente, documentação superior, SDKs impecáveis, Stripe Billing maduro para SaaS.
- **Contras:** **Sem suporte nativo a Boleto Bancário** (bloqueador crítico), PIX como beta/limitado, conversão de moeda pode gerar confusion pricing, usuário brasileiro menos familiarizado com Stripe.

### Opção 3: PagSeguro
- **Prós:** Brasileiro, conhecido.
- **Contras:** SDK mais antigo, documentação inferior, menor market share entre startups modernas, sem assinaturas nativas robustas.

### Opção 4: Iugu
- **Prós:** Bom para B2B, marketplace.
- **Contras:** Mais voltado para marketplace/split payment, menos name recognition com consumidor final, custo extra.

## Decisão

Adotar **Mercado Pago SDK 2.x** como único gateway de pagamentos.

## Justificativa

1. **PIX e Boleto são imperativos:** Uma parcela significativa dos alunos target (adultos de 25-50 anos praticantes de academia no Brasil) usa boleto ou PIX como método preferencial. Stripe não oferece isso nativamente — seria um bloqueador de conversão.

2. **Confiança do consumidor:** Mercado Pago tem alta brand recognition no Brasil. O logo no checkout aumenta conversão por ser um nome familiar.

3. **Assinaturas recorrentes nativas:** `preapproval` API do Mercado Pago suporta cobrança automática sem redirecionamento — crucial para minimizar churn por esquecimento de pagamento.

4. **SDK TypeScript oficial:** `mercadopago` npm package com tipos incluídos, compatível com Node.js + Next.js.

## Consequências

### Positivas
- Suporte a todos os métodos de pagamento relevantes no Brasil
- Fluxo de assinatura automática nativo sem lógica manual de cobrança
- Webhooks de status (APPROVED, REJECTED, PENDING) para automação

### Negativas
- **Idempotência de webhooks não implementada:** Mercado Pago pode reenviar webhooks em falha — necessário `processedPaymentIds` para evitar processamento duplicado.
- **Reconciliação manual:** Sem jobs automatizados para reconciliar pagamentos rejeitados com suspensão de assinatura.
- **Sandbox limitado:** O ambiente de testes do Mercado Pago é menos robusto que o do Stripe.

### Riscos ativos ⚠️

- **Risco:** Webhook processado duas vezes pode creditar assinatura duplicada.
  - **Mitigação prioritária:** Implementar tabela `ProcessedWebhook(paymentId)` com unique constraint antes de ir a produção.

- **Risco:** Falha no webhook → assinatura ativa mesmo sem pagamento real.
  - **Mitigação:** Job diário que verifica status de assinaturas ativas via API do Mercado Pago.

## Fluxo Implementado

```
Aluno escolhe plano → 
  POST /api/checkout → cria preferência Mercado Pago →
  Redirect para checkout Mercado Pago →
  Mercado Pago processa pagamento →
  Webhook POST /api/webhooks/mercadopago →
  Atualiza Assinatura.status = ATIVA →
  Redireciona para /aluno/dashboard
```

## Referências

- [Mercado Pago Developers](https://www.mercadopago.com.br/developers/pt)
- [Mercado Pago SDK NPM](https://www.npmjs.com/package/mercadopago)
- [Webhooks Documentation](https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks)
