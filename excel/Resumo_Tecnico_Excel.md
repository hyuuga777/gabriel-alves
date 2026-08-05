# Resumo Técnico para Implementação de Sistema - Ficha Gabriel Alves

Este documento apresenta uma análise técnica detalhada das abas contidas no arquivo `FichaGabrielAlvesv6-Copia.xlsx`, visando orientar a equipe da **Antigravity** na implementação das funcionalidades no sistema.

---

## 1. Estrutura Geral do Arquivo
O arquivo é composto por **15 abas**, abrangendo desde cadastros auxiliares até protocolos de testes físicos e avaliações evolutivas.

| Aba | Finalidade Principal | Tipo de Dado |
| :--- | :--- | :--- |
| **Observações** | Registro de anamnese e objetivos do aluno | Texto livre / Formulário |
| **Pivot** | Agrupamento dinâmico de exercícios por grupo muscular | Tabela Dinâmica |
| **Uso interno** | Banco de dados mestre de exercícios por categoria | Cadastro / Referência |
| **Tabelas %G** | Referências normativas de percentual de gordura | Tabela de Consulta (Lookup) |
| **Rotina** | Agenda semanal de horários do aluno | Matriz Horário x Dia |
| **Menu** | Interface de navegação e seleção de perfil (M/F) | UI / Controle |
| **Avaliação Presencial** | Coleta de dados antropométricos e composição corporal | Formulário de Entrada |
| **Avaliação Online** | Acompanhamento de medidas enviado pelo aluno | Formulário de Entrada |
| **Nivel de treinamento** | Classificação do status atual do aluno | Referência |
| **Teste ANAEROBIA** | Protocolos de potência e resistência anaeróbia | Teste Físico |
| **Teste AEROBIO** | Protocolo de teste de 6 minutos (VO2) | Teste Físico |
| **Teste ISOMETRICA** | Testes de resistência muscular estática | Teste Físico |
| **Avaliação Postural** | Registro de desvios posturais em múltiplos planos | Checklist / Análise |
| **Avaliacao Fotos Antes e Depois** | Comparativo visual e evolutivo | Galeria / Evolução |
| **Planilha2** | Aba auxiliar de controle de versão da avaliação | Auxiliar |

---

## 2. Detalhamento por Aba

### 2.1. Uso interno (Banco de Dados de Exercícios)
Esta é a aba fundamental para o módulo de prescrição de treinos.
- **Estrutura:** Colunas separadas por grupos musculares (**ABS, ADUTOR, BÍCEPS, COSTAS, FUNCIONAL, GÊMEOS, GLÚTEO, ISQUIOSSURAIS, LOMBAR, OMBRO, PEITORAL, QUADRÍCEPS, TIBIAL, TRAPÉZIO, TRÍCEPS**).
- **Lógica:** Cada coluna contém uma lista exaustiva de nomes de exercícios.
- **Implementação:** Deve ser tratada como uma tabela de `Exercicios` com relacionamento `N:1` para `GrupoMuscular`.

### 2.2. Avaliação Presencial & Online
Abas críticas para o módulo de evolução.
- **Campos Principais:** Data de Nascimento, Idade, Peso, Estatura, e seções de dobras cutâneas/medidas.
- **Lógica Evolutiva:** Ambas as abas possuem colunas para múltiplas avaliações (AV1 a AV10), permitindo comparação temporal.
- **Cálculos Implícitos:** Utiliza as tabelas da aba **Tabelas %G** para classificar o percentual de gordura com base em idade e sexo (Protocolos Pollock/Lohman).

### 2.3. Protocolos de Testes (AEROBIO, ANAEROBIA, ISOMETRICA)
- **Teste AEROBIO:** Focado no "Teste de 6 minutos". Requer campos para distância percorrida, FC inicial/final e cálculo de VO2 estimado.
- **Teste ANAEROBIA:** Estrutura para testes de carga máxima ou repetições até a falha.
- **Teste ISOMETRICA:** Grade comparativa para tempo de sustentação em exercícios específicos.

### 2.4. Avaliação Postural
- **Planos de Análise:** Frontal, Lateral e Posterior.
- **Estrutura:** Lista de segmentos corporais (Cabeça, Ombros, Coluna, Pelve, Joelhos, Pés) com campos para marcar desvios (ex: Protuso, Elevado, Valgo, Varo).
- **Implementação:** Sugere-se um componente de checklist ou seletor de status para cada segmento em cada avaliação.

### 2.5. Rotina
- **Matriz:** Linhas representando horários (06:00 às 23:00) e colunas representando os dias da semana.
- **Uso:** Mapeamento de disponibilidade para prescrição de treinos.

---

## 3. Recomendações para Antigravity
1. **Normalização:** Os dados da aba `Uso interno` devem ser migrados para uma estrutura de banco de dados relacional.
2. **Motor de Cálculo:** Implementar as fórmulas de composição corporal (densidade corporal -> % gordura) no backend, utilizando as referências da aba `Tabelas %G`.
3. **Módulo de Fotos:** A aba `Avaliacao Fotos Antes e Depois` indica a necessidade de um sistema de upload de imagens com marcação de data e tipo de plano (Frontal/Lateral/Costas).
4. **Histórico:** O sistema deve suportar a estrutura de "Avaliações Seriadas" (AV1...AVn) observada nas abas de medidas.

---
**Fim do Resumo Técnico.**
