# Evidências de Teste - Hardening V2

As implementações foram testadas e validadas através de injeção direta de memória e leitura estrita de buffer, não dependendo de mock de banco.

## 1. Teste de Idempotência (Local)
Ao executar `scripts/test-hardening.ts`, validamos que a segunda vez que a planilha for enviada pelo **mesmo treinador**, o importador apontará `CONFLITO_MANUAL` (Hash Colidindo). Se um **treinador diferente** enviar, a ficha entrará como `NOVA`, provando que a injeção do Tenant ID é real e o escopo foi mantido isolado.

## 2. Teste do Bug do Excel 1900
A data de avaliação que no excel era `45812.125` foi interpretada isoladamente por UTC puro usando a correção do dia fantasma (`serial === 60`) sem sofrer deslocamentos por fuso horário.

## 3. Segurança do DB
Nenhuma transação destrutiva `db push` ou `migrate dev` foi realizada no banco original para poupar a infraestrutura de produção. O Prisma Schema local foi apenas modificado e aguarda sync manual em pipeline ou staging. O parser trabalhou apenas com o Memory ArrayBuffer do arquivo original `Ficha Gabriel Alves v6 - Copia.xlsx`.
