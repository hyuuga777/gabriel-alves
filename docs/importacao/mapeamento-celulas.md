# Mapeamento de Células (XLSX para PostgreSQL)

Baseado na aba "Menu" e "Avaliação Presencial" da planilha `Ficha Gabriel Alves v6 - Copia.xlsx`.

## Aba: Menu

| Campo na Planilha | Coordenada (Aprox) | Entidade Destino | Campo Destino | Tipo/Transformação | Nível Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ALUNO | `E15` | `User` | `name` | String | Alto |
| SEXO | `E16` | `AlunoProfile` | `genero` | Enum (MASCULINO/FEMININO) | Alto |
| DATA DE NASCIMENTO | `E20` | `AlunoProfile` | `dataNascimento` | Date (ISO) | Alto |
| Plano adquirido | `E28` | `Assinatura / Plano` | `planoId` | Foreign Key (Busca) | Médio |
| Data de Inicio | `E29` | `Assinatura` | `dataInicio` | Date (ISO) | Alto |
| Data do Fim | `E30` | `Assinatura` | `dataFim` | Date (ISO) | Alto |
| Valor | `E31` | `Pagamento / Assinatura`| `valor` | Float | Alto |
| Meio de pagamento | `I31` | `Pagamento` | `metodoPagamento` | String | Médio |
| Dores e Intensidade | `E34` | `AlunoProfile` | `doresIntensidade` | String (Text) | Alto |
| Principais objetivo | `E35` | `AlunoProfile` | `objetivos` | String (Text) | Alto |
| Principais Limitação | `E36` | `AlunoProfile` | `limitacoes` | String (Text) | Alto |
| Referencia de Objetivo | `E37` | `AlunoProfile` | `referenciaObjetivo` | String (Text) | Alto |
| Pontos fracos | `E38` | `AlunoProfile` | `pontosFracos` | String (Text) | Alto |
| Pontos fortes | `E39` | `AlunoProfile` | `pontosFortes` | String (Text) | Alto |
| Exercicios Proibidos | `E40` | `AlunoProfile` | `exerciciosProibidos`| String (Text) | Alto |

## Lista de Métodos (Aba Menu - Linha 44 em diante)
- A planilha traz os métodos em colunas estáticas nas linhas 45-74.
- Destino: `TreinoLog` (ou referenciado via string array no MVP, mas a arquitetura estipulou registro em histórico se as colunas de "Data" estiverem preenchidas).

## Aba: Avaliação Presencial (Histórico de Medidas)
As avaliações ocorrem em colunas empilhadas horizontalmente (ex: G, H, I, J...).

| Métrica | Linha | Entidade Destino | Campo Destino | Tipo/Transformação | Nível Confiança |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Data da Avaliação | `11` | `Avaliacao` | `data` | Date (ISO) | Alto |
| Peso Total | `16` | `Avaliacao` | `peso` | Float (kg) | Alto |
| Dobras Cutâneas (soma)| `18-24` | `Avaliacao` | `dobrasCutaneas` | JSONB / Text | Médio |
| % de Gordura | `28` (calculado) | `Avaliacao` | `percentualGordura`| Float | Alto |
