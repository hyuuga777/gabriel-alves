# Manual Operacional (Importação XLSX)

Este documento é a referência para executar a ferramenta de importação do Sistema Antigravity/Fitness SaaS.

## 1. Subindo um Arquivo (Simulação)
O Personal Trainer clica em "Importar Ficha", seleciona o arquivo `.xlsx` do disco e o envia.
- A API retorna imediatamente uma tabela listando os Alunos Encontrados, Erros de Leitura e Avisos de Conflito.
- **Nenhum registro é salvo em banco de dados neste instante.** Um `ImportBatch` é gerado, mas as tabelas do negócio ficam isoladas.

## 2. Lidando com Avisos (Warnings)
- **E-mails gerados automaticamente:** Caso falte o e-mail na ficha, a plataforma usará `nome@import.local`. Isso é visível na tela e o usuário precisa estar ciente.
- **Datas Nulas/Quebradas:** Se uma avaliação não tem data (ex: `#REF!`), a ferramenta pode acusar erro fatal para *aquela* avaliação, impedindo a sua migração isolada, mas não corrompendo a ficha do aluno. O usuário verá a lista "Avaliação 3: Data Inválida (Descartada)".

## 3. Confirmação (Persistência)
Quando o Treinador avalia o dashboard de Simulação e clica em "Confirmar Importação":
1. O backend rodará uma `Prisma.$transaction` encapsulando toda a ficha.
2. A inserção não mistura os dados graças ao `treinadorId` imposto automaticamente.
3. Mensagens de sucesso são gravadas no registro de Lotes de Importação.

## 4. Auditoria e Rollback (Undo)
Para cancelar uma importação feita indevidamente:
- Na lista de "Meus Lotes de Importação", selecione o ID do Batch.
- Clique em "Desfazer Importação".
- Isso acionará a rota de Revert que exclui (ou desfaz) os dados criados associados diretamente àquele ID.

> **Importante:** Sempre teste arquivos menores antes da carga completa.
