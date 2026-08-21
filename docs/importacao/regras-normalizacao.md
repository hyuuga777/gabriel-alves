# Regras de Normalização (Importação XLSX)

Este documento define os critérios de conversão dos dados extraídos do XLSX para o banco PostgreSQL.

## 1. Datas
- **Formato Excel (1900-epoch):** O Excel guarda datas como o número de dias desde 01/01/1900. O conversor utilizará a lógica: `new Date((valorExcel - 25569) * 86400 * 1000)` ajustando o fuso horário local, a fim de que a data convertida corresponda perfeitamente ao dia (ex: `45557` = `2024-09-22`).
- **Data de Vencimento:** A planilha soma os dias ou faz `Data do Fim - Data de Inicio`. Na normalização, armazenamos o momento (DataFim) e o frontend fará o cálculo de 'dias restantes'.

## 2. Números e Métricas Físicas
- **Tipos de Ponto e Vírgula:** A biblioteca converte internamente números contendo vírgula para `Number` flutuantes (ex: `"1,87"` -> `1.87`).
- **Peso (kg):** Armazenado como `Float`, duas casas decimais permitidas, restrito para ser `> 0`. 
- **Altura (m/cm):** Como a planilha exibe `"1,87"`, normalizamos para Float e consideramos sempre como "Metros".
- **IMC:** Armazenaremos o IMC recalculado pelo sistema via fórmula `Peso / (Altura * Altura)`, substituindo a fórmula obscura, mantendo precisão padronizada (duas casas decimais no frontend).

## 3. Textos Livres (Anamnese)
- Campos como `doresIntensidade`, `limitacoes` etc. serão mantidos no valor literal, preservando acentos, espaços e quebras de linha (`\n`), mas aplicando um `trim()` básico.
- Caso o campo original venha vazio (ou como "0", "", `#REF!`), será tratado como `null` no banco.

## 4. Estruturação do Histórico
- Em vez de uma entidade estática, as avaliações (G11, H11, I11 etc) gerarão registros *separados* da entidade `Avaliacao`, todos vinculados ao mesmo `User`.
- Valores não fornecidos em colunas de avaliação subsequente (ex: Dobras vazias na Avaliação 2) permanecerão nulos naquele registro temporal, não herdando obrigatoriamente a anterior, mantendo fidelidade histórica.

## 5. Sexo e Identidade
- Os literais "MASCULINO", "FEMININO" lidos da planilha serão gravados diretamente, com a primeira letra maiúscula se desejado pela View. Na ausência, assume "Não informado".
