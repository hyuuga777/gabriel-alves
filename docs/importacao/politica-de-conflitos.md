# Política de Idempotência e Conflitos

## Idempotência por Hash Técnico
O sistema foi configurado para **NUNCA** fazer um "upsert cego" que pudesse sobrescrever dados valiosos.
- A ficha tem uma identidade baseada no hash do nome e da data de nascimento: `sourceHash`.
- Cada avaliação possui um hash em sua linha e coluna originais da planilha.

## Resolução Manual de Conflitos
Quando a rota `simulate` encontrar um hash idêntico ou nomes conflitantes, o status do Aluno será marcado como `CONFLITO_MANUAL`.
A API de confirmação não agirá até que o treinador especifique explicitamente a decisão:
1. **CRIAR_NOVO:** Trata como um homônimo ou ficha distinta.
2. **IGNORAR:** Despreza os dados oriundos da nova importação.
3. **SOBRESCREVER (Por Campo):** Aplica as substituições pontuais fornecidas pelo payload de confirmação.

Nenhuma avaliação ou pagamento existente será apagado, garantindo o registro histórico.
