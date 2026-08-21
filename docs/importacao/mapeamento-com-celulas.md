# Mapeamento do Arquivo com Células

A ferramenta foi refatorada e validada para extrair metadados e graus de confiança (alta/baixa/fórmula) da aba *Menu* e *Avaliação Presencial*.

## Menu
| Entidade | Coluna/Célula | Tratamento |
|---|---|---|
| Nome | E15 | String limpa |
| Gênero | E16 | String limpa |
| Nascimento | E20 | Convertida de Excel Date (Epoch 1900) para UTC-3 (JS Date) |
| Plano | E28 | String |
| Data Início | E29 | Date Convertida |
| Data Fim | E30 | Date Convertida |
| Valor | E31 | Number Parsed |
| Dores | E34 | String |
| Objetivos | E35 | String |
| Exercícios Proibidos| E40 | String |

## Avaliação Presencial
Lida iterativamente (loop em colunas G, H, I, J, K, L, M, N, O, P):
- **Data (Linha 11)** -> Extrato primário (define a existência da avaliação)
- **Peso (Linha 16)** -> Número, tolerando casas decimais brasileiras.
- **Percentual de Gordura (Linha 28)** -> Número.
- **Métricas Secundárias (ex: Dobras Cutâneas)**: Adicionadas posteriormente de forma dinâmica.

O parser é flexível para retornar campos nulos sem quebrar se a célula estiver em branco.
