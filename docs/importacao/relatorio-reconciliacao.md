# Relatório de Reconciliação do Importador

## Estratégia de Normalização
1. **Dados Biométricos (Peso, Altura):** Valores inválidos ou vazios resultam em `null`, não afetando a média nem quebrando cálculos posteriores na UI.
2. **IMC:** Recalculado usando `Peso / (Altura * Altura)` apenas se ambos estiverem presentes. Fórmulas antigas da planilha são ignoradas se corrompidas.
3. **Percentual de Gordura (BF):** Células `#REF!` são perfeitamente normalizadas para `null`. O sistema preserva o histórico sem travar.

## Reconciliação de Identidade
O `externalSourceId` agrupa todas as abas (mesmo aluno) sob a mesma identidade. 
Se a ficha na planilha tiver o nome ligeiramente alterado, mas o `externalSourceId` for igual, a importação não multiplicará alunos.
