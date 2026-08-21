# Critérios de Aceite

## Geral
- O sistema deve ser responsivo e usável em dispositivos móveis.
- Não deve haver perda de dados entre recarregamentos de página (persistência no BD).

## Avaliações
- O IMC deve ser calculado automaticamente caso Peso e Altura sejam preenchidos. Fórmula inferida: `Peso / (Altura * Altura)`.
- As avaliações devem ser ordenadas cronologicamente.

## Contratos
- O sistema deve alertar (visualmente) contratos que vencem nos próximos 7 dias ou que já estão vencidos.
- Cálculo de dias para vencimento deve bater com: `Data do Fim - Data Atual`.

## Importação
- A importação não pode duplicar alunos (validar por nome ou criar chave).
- O arquivo original XLSX e CSV gerados não devem ser apagados.
- Deve gerar um log de "Batch de Importação" com registros de sucesso e falha.
