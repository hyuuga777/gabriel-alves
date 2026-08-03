```python
import pandas as pd

file_path = "Ficha Gabriel Alves v6 - Copia.xlsx"
try:
    xls = pd.ExcelFile(file_path)
    sheets = xls.sheet_names
    
    sheet_info = {}
    for sheet in sheets:
        df = pd.read_excel(xls, sheet_name=sheet)
        sheet_info[sheet] = {
            "columns": list(df.columns),
            "num_rows": len(df),
            "sample": df.head(3).to_dict()
        }
    
    print("Sheets:", sheets)
    for sheet, info in sheet_info.items():
        print(f"\n--- Sheet: {sheet} ---")
        print(f"Columns: {info['columns']}")
        print(f"Num Rows: {info['num_rows']}")
        # print(f"Sample: {info['sample']}") # Might be too verbose, just columns for now, or just print them nicely
        
except Exception as e:
    print(f"Error: {e}")

```

```text
Sheets: ['Observações', 'Pivot', 'Uso interno', 'Tabelas %G', 'Rotina', 'Menu', 'Avaliação Presencial', 'Avaliação Online', 'Nivel de treinamento', 'Teste ANAEROBIA', 'Teste AEROBIO', 'Teste ISOMETRICA', 'Avaliação Postural', 'Avaliacao Fotos Antes e Depois', 'Planilha2']

--- Sheet: Observações ---
Columns: ['Unnamed: 0', nan, 'Unnamed: 2']
Num Rows: 10

--- Sheet: Pivot ---
Columns: ['GRUPO MUSCULAR', 'TRÍCEPS']
Num Rows: 19

--- Sheet: Uso interno ---
Columns: ['GRUPO MUSCULAR', 'Unnamed: 1', 'ABS', 'ADUTOR', 'BÍCEPS', 'COSTAS', 'FUNCIONAL', 'GÊMEOS', 'GLÚTEO_MÁXIMO', 'GLÚTEO_MÉDIO', 'ISQUIOSSURAIS', 'LOMBAR', 'OMBRO', 'PEITORAL', 'QUADRÍCEPS', 'TIBIAL', 'TRAPÉZIO', 'TRÍCEPS']
Num Rows: 211

--- Sheet: Tabelas %G ---
Columns: ['Unnamed: 0', nan, 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10']
Num Rows: 21

--- Sheet: Rotina ---
Columns: ['Unnamed: 0', nan, 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8']
Num Rows: 18

--- Sheet: Menu ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11']
Num Rows: 73

--- Sheet: Avaliação Presencial ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16']
Num Rows: 79

--- Sheet: Avaliação Online ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14']
Num Rows: 23

--- Sheet: Nivel de treinamento ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4']
Num Rows: 46

--- Sheet: Teste ANAEROBIA ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'NÃO MEXER ->', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16', 'Unnamed: 17', 'Unnamed: 18', 'Unnamed: 19']
Num Rows: 58

--- Sheet: Teste AEROBIO ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16', 'Unnamed: 17', 'Unnamed: 18', 'Unnamed: 19', 'Unnamed: 20', 'Unnamed: 21', 'Unnamed: 22', 'Unnamed: 23', 'Unnamed: 24', 'Unnamed: 25', 'Unnamed: 26', 'Unnamed: 27', 'Unnamed: 28']
Num Rows: 28

--- Sheet: Teste ISOMETRICA ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16', 'Unnamed: 17', 'Unnamed: 18', 'Unnamed: 19', 'Unnamed: 20', 'Unnamed: 21', 'Unnamed: 22']
Num Rows: 25

--- Sheet: Avaliação Postural ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16', 'Unnamed: 17', 'Unnamed: 18', 'Unnamed: 19', 'Unnamed: 20', 'Unnamed: 21', 'Unnamed: 22', 'Unnamed: 23', 'Unnamed: 24']
Num Rows: 105

--- Sheet: Avaliacao Fotos Antes e Depois ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4', 'Unnamed: 5', 'Unnamed: 6', 'Unnamed: 7', 'Unnamed: 8', 'Unnamed: 9', 'Unnamed: 10', 'Unnamed: 11', 'Unnamed: 12', 'Unnamed: 13', 'Unnamed: 14', 'Unnamed: 15', 'Unnamed: 16', 'Unnamed: 17', 'Unnamed: 18', 'Unnamed: 19', 'Unnamed: 20', 'Unnamed: 21', 'Unnamed: 22', 'Unnamed: 23', 'Unnamed: 24']
Num Rows: 43

--- Sheet: Planilha2 ---
Columns: ['Unnamed: 0', 'Unnamed: 1', 'Unnamed: 2']
Num Rows: 1


```

```python
import pandas as pd
import json

file_path = "Ficha Gabriel Alves v6 - Copia.xlsx"
try:
    xls = pd.ExcelFile(file_path)
    sheets = xls.sheet_names
    
    output = {"sheets": sheets, "details": {}}
    for sheet in sheets:
        df = pd.read_excel(xls, sheet_name=sheet, nrows=5)
        output["details"][sheet] = {
            "columns": list(df.columns),
            "num_rows": "unknown (read head only)",
        }
    
    print(json.dumps(output, indent=2))
except Exception as e:
    print(f"Error: {e}")

```

```text
{
  "sheets": [
    "Observa\u00e7\u00f5es",
    "Pivot",
    "Uso interno",
    "Tabelas %G",
    "Rotina",
    "Menu",
    "Avalia\u00e7\u00e3o Presencial",
    "Avalia\u00e7\u00e3o Online",
    "Nivel de treinamento",
    "Teste ANAEROBIA",
    "Teste AEROBIO",
    "Teste ISOMETRICA",
    "Avalia\u00e7\u00e3o Postural",
    "Avaliacao Fotos Antes e Depois",
    "Planilha2"
  ],
  "details": {
    "Observa\u00e7\u00f5es": {
      "columns": [
        "Unnamed: 0",
        NaN,
        "Unnamed: 2"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Pivot": {
      "columns": [
        "GRUPO MUSCULAR",
        "TR\u00cdCEPS"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Uso interno": {
      "columns": [
        "GRUPO MUSCULAR",
        "Unnamed: 1",
        "ABS",
        "ADUTOR",
        "B\u00cdCEPS",
        "COSTAS",
        "FUNCIONAL",
        "G\u00caMEOS",
        "GL\u00daTEO_M\u00c1XIMO",
        "GL\u00daTEO_M\u00c9DIO",
        "ISQUIOSSURAIS",
        "LOMBAR",
        "OMBRO",
        "PEITORAL",
        "QUADR\u00cdCEPS",
        "TIBIAL",
        "TRAP\u00c9ZIO",
        "TR\u00cdCEPS"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Tabelas %G": {
      "columns": [
        "Unnamed: 0",
        NaN,
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7",
        "Unnamed: 8",
        "Unnamed: 9",
        "Unnamed: 10"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Rotina": {
      "columns": [
        "Unnamed: 0",
        NaN,
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7",
        "Unnamed: 8"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Menu": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Avalia\u00e7\u00e3o Presencial": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Avalia\u00e7\u00e3o Online": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7",
        "Unnamed: 8",
        "Unnamed: 9",
        "Unnamed: 10",
        "Unnamed: 11",
        "Unnamed: 12",
        "Unnamed: 13",
        "Unnamed: 14"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Nivel de treinamento": {
      "columns": [],
      "num_rows": "unknown (read head only)"
    },
    "Teste ANAEROBIA": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "N\u00c3O MEXER ->"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Teste AEROBIO": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Teste ISOMETRICA": {
      "columns": [],
      "num_rows": "unknown (read head only)"
    },
    "Avalia\u00e7\u00e3o Postural": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7",
        "Unnamed: 8",
        "Unnamed: 9",
        "Unnamed: 10",
        "Unnamed: 11",
        "Unnamed: 12",
        "Unnamed: 13",
        "Unnamed: 14",
        "Unnamed: 15",
        "Unnamed: 16",
        "Unnamed: 17",
        "Unnamed: 18",
        "Unnamed: 19",
        "Unnamed: 20",
        "Unnamed: 21",
        "Unnamed: 22",
        "Unnamed: 23",
        "Unnamed: 24"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Avaliacao Fotos Antes e Depois": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2",
        "Unnamed: 3",
        "Unnamed: 4",
        "Unnamed: 5",
        "Unnamed: 6",
        "Unnamed: 7",
        "Unnamed: 8",
        "Unnamed: 9",
        "Unnamed: 10",
        "Unnamed: 11",
        "Unnamed: 12",
        "Unnamed: 13",
        "Unnamed: 14",
        "Unnamed: 15",
        "Unnamed: 16",
        "Unnamed: 17",
        "Unnamed: 18",
        "Unnamed: 19",
        "Unnamed: 20",
        "Unnamed: 21",
        "Unnamed: 22",
        "Unnamed: 23",
        "Unnamed: 24"
      ],
      "num_rows": "unknown (read head only)"
    },
    "Planilha2": {
      "columns": [
        "Unnamed: 0",
        "Unnamed: 1",
        "Unnamed: 2"
      ],
      "num_rows": "unknown (read head only)"
    }
  }
}


```

```python
import pandas as pd
import numpy as np

file_path = "Ficha Gabriel Alves v6 - Copia.xlsx"
xls = pd.ExcelFile(file_path)

def get_sheet_summary(sheet_name):
    df = pd.read_excel(xls, sheet_name=sheet_name, header=None)
    # Get a sense of what text is in the sheet (non-null strings)
    text_cells = []
    for row in df.itertuples(index=False):
        for cell in row:
            if isinstance(cell, str) and str(cell).strip() != "":
                text_cells.append(str(cell).strip())
    
    # Return top 30 unique text strings to understand the sheet's purpose
    seen = set()
    unique_texts = []
    for text in text_cells:
        if text not in seen:
            seen.add(text)
            unique_texts.append(text)
            
    return unique_texts[:30]

for sheet in xls.sheet_names:
    print(f"\n--- {sheet} ---")
    try:
        print(get_sheet_summary(sheet))
    except Exception as e:
        print(f"Error: {e}")

```

```text

--- Observações ---
['Data', 'Observações', 'Objetivos:', 'Lesões mais graves:', 'Avaliações:', 'Treino atual', 'Disponibilidade de treinos']

--- Pivot ---
['GRUPO MUSCULAR', 'TRÍCEPS', 'Rótulos de Linha', 'FLEXÃO BRAÇOS FECHADA', 'TRÍCEPS COICE UNILATERAL', 'TRÍCEPS FRANCÊS DUMBBELL', 'TRÍCEPS FRANCÊS POLIA CORDA', 'TRÍCEPS FRANCÊS POLIA UNILATERAL', 'TRÍCEPS FRANCÊS UNILATERAL', 'TRÍCEPS POLIA BARRA RETA', 'TRÍCEPS POLIA BARRA RETA INVERTIDO', 'TRÍCEPS POLIA CORDA', 'TRÍCEPS POLIA UNILATERAL', 'TRÍCEPS TESTA BARRA "H"', 'TRICEPS TESTA BARRA RETA', 'TRÍCEPS TESTA POLIA BARRA RETA', 'TRÍCEPS TESTA POLIA CORDA', 'TRÍCEPS TESTA POLIA UNILATERAL', 'TRÍCEPS TESTA TRX', 'Total Geral']

--- Uso interno ---
['GRUPO MUSCULAR', 'ABS', 'ADUTOR', 'BÍCEPS', 'COSTAS', 'FUNCIONAL', 'GÊMEOS', 'GLÚTEO_MÁXIMO', 'GLÚTEO_MÉDIO', 'ISQUIOSSURAIS', 'LOMBAR', 'OMBRO', 'PEITORAL', 'QUADRÍCEPS', 'TIBIAL', 'TRAPÉZIO', 'TRÍCEPS', 'FUNÇÃO UNIQUE', 'ABDOMINAL MÃO ESPALDAR', 'ADUÇÃO CANELEIRA SOLO', 'ROSCA "T" POLIA', 'BARRA FIXA ABERTA', 'BURPEE', 'GÊMEOS EM PÉ STEP', 'AFUNDO CAIXOTE', 'ABDUÇÃO CANELEIRA SOLO', 'CADEIRA FLEXORA', 'EXTENSAO TRONCO BANCO DORSAL', 'CRUCIFIXO INVERTIDO CURVADO DUMBELL', 'CROSS OVER CURV POLIA ALTA']

--- Tabelas %G ---
['% de gordura para crianças e adolescentes (7 a 17 anos de idade)', '% de gordura para Mulheres', 'Meninos', 'Meninas', 'Nível /Idade', '18 - 25', '26 - 35', '36 - 45', '46 - 55', '56 - 65', 'Excessivamente Baixa', 'Até 6', 'Até 12', 'Excelente', '13 a 16', '14 a 16', '16 a 19', '17 a 21', '18 a 22', 'Baixa', '6 a 10', '12 a 15', 'Bom', '17 a 19', '18 a 20', '20 a 23', '23 a 25', '24 a 26', 'Adequada', '10 a 20']

--- Rotina ---
['Horário', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

--- Menu ---
['MASCULINO', 'FEMININO', 'ALUNO:', 'Gabriel', 'SEXO:', 'PESO (kg):', 'ALTURA (m):', 'IMC (kg/m²):', 'DATA DE NASCIMENTO:', 'DATA DA AVALIAÇÃO:', 'Informações Sobre Tempo Contrato', 'Plano adiquirido:', 'Data de Inicio:', 'Data do Fim:', 'Dias p/ Fim do Ciclo:', '4 Dias para o vencimento', 'Valor:', 'Meio de pagamento:', 'Informações Sobre o Aluno', 'Dores e Intensidade:', 'Principais objetivo:', 'Principais Limitação:', 'Referencia de Objetivo:', 'Pontos fracos:', 'Pontos fortes:', 'Exercicios Proibidos:', 'Metodos Utilizados:', 'METODOS:', 'Data:', 'Observações:']

--- Avaliação Presencial ---
['AVALIAÇÃO PRESENCIAL', 'ALUNO:', 'Gabriel', 'SEXO:', 'MASCULINO', 'DATA DE NASCIMENTO:', 'SEÇÃO DE ANÁLISE', 'DATA:', 'INTERVALO ENTRE AS AVALICOES:', 'IDADE:', 'HORARIO:', 'CIRCUNFERENCIA', 'AV1', 'AV2', 'AV3', 'AV4', 'AV5', 'AV6', 'AV7', 'AV8', 'AV9', 'AV10', 'Pescoco', 'Ombros', 'Tórax Expirando', 'Tórax Inspirando', 'Braço direito Relaxado', 'Braço direito Contraido', 'Braço esquerdo Relaxado', 'Braço esquerdo Contraido']

--- Avaliação Online ---
['AVALIAÇÃO ONLINE', 'ALUNO:', 'Gabriel', 'COMO MEDIR →', 'Braço', 'Ombro-a-ombro', 'Tórax', 'Coxa', 'Panturrilha', 'Abdominal, Cintura e Quadril', 'DATA ---------->', 'AVALIAÇÃO COMPARAÇÃO', 'PARTE DO CORPO', 'AV1', 'AV2', 'AV3', 'AV4', 'AV5', 'AV6', 'AV7', 'AV8', 'AV9', 'AV10', 'DATA AVALIAÇÃO', 'Braço direito Relaxado', 'ANÁLISE DOS DADOS', 'Braco Direito Contraio', 'Braço esquerdo Relaxado', 'Peso', 'Braco Esquerdo Contraio']

--- Nivel de treinamento ---
['CALCULADORA', 'Iniciante             (1 ponto)', 'Intermediário          (2 pontos)', 'Avançado           (3 pontos)', 'Ext. avançado           (4 pontos)', 'Tempo de treino sem interupção', 'Destreino', 'Experiência prévia', 'Técnica', 'Valores de força', 'Total', 'Média', 'REFERÊNCIA:', 'SANTOS JUNIOR, E. R. T. ; SALLES, B. F. ; DIAS, I. ; RIBEIRO, A. S. ; SIMÃO, R. . Classification and Determination Model of Resistance Training Status. STRENGTH AND CONDITIONING JOURNAL, 2021.']

--- Teste ANAEROBIA ---
['NÃO MEXER ->', 'PARTE ANAERÓBIA', 'Teste de resistência de carga/ 1RM SUPERIORES', 'Teste de resistência de carga/ 1RM INFERIORES', 'Data do teste', 'Exercício', 'Nº de repetições (entre 1 e 15)', 'Carga (kg)', 'Link do exercício', '%1RM CORRESPONDENTE', 'CARGA*100/%1RM', '1RM referente ao exercício feito', 'Supino reto', 'Cadeira flexora', 'Puxada frontal', '-', 'USO INTERNO', 'EXERCÍCIOS 1RM', 'Nº de repetições', '% 1RM', 'Supino inclinado no smith', 'Desenvolvimento máquina', 'Supino inclinado', 'Extensora', 'Mesa flexora', 'Agachamento livre com a barra', 'Leg press 45']

--- Teste AEROBIO ---
['TESTE FÍSICO', 'ALUNO:', 'Gabriel', 'Teste 6 minutos', 'PARTE AERÓBIA', 'TESTE COOPER 12 MIN', 'TESTE INCREMENTAL', 'Data do teste', 'Distância percorrida em 12min (m)', 'VO2 máximo (ml.kg/min)', 'Velocidade inicial (km/h)', 'Duração dos estágios (s)', 'Incremento de velocidade por estágio (km/h)', 'Velocidade máxima atingida (km/h)', 'Nº de estágios atingidos', 'Duração do teste (min)', 'OBS', '-']

--- Teste ISOMETRICA ---
['PARTE DE ISOMETRIA', 'PARTE POTENCIA', 'Tempo gasto em segundos', 'DATA:', 'Data do teste', 'Prancha frontal >60 seg', 'Prancha lateral direita >45seg', 'Prancha lateral esquerda >45seg', 'Teste de Sorensen >60seg', 'Cadeirinha Bilateral >60seg', 'Cadeirinha Unilateral Direita >30seg', 'Cadeirinha Unilateral Esquerda >30seg', 'Flexao sem apoio >30seg', 'Flexao com apoio >45seg', 'Agachamento com peso (20 a 25% PC) >60 seg', 'THRUSTER >25REPS                              10 A 20% PC', 'CARGA KG', 'TEMPO', 'TAXA', 'ABDOMINAL REMADOR', 'FLEXAO DE BRACO']

--- Avaliação Postural ---
['AVALIAÇÃO POSTURAL', 'ALUNO:', 'Gabriel', 'Avaliacao 1', 'Avaliacao 2', 'Avaliacao 3', 'Avaliacao 4', 'Avaliacao 5', 'Avaliacao 6', 'Frontal', 'Lateral', 'Data:', 'Tras', 'VISTA POSTERIOR', 'VISTA FRONTAL', 'VISTA LATERAL', 'PARTE DO CORPO', 'AVALIAÇÃO ALUNO', 'NIVEL DO DESVIO', 'MÚSCULOS ENCURTADOS', 'MÚSCULOS FRACOS', 'COLUNANeutra', 'COLUNA', 'Neutra', '- Músculo 1;\n- Músculo 2;\n- Músculo 3;\n- Músculo 4;\n- Músculo 5.', 'CABEÇAInclinada - esquerda', 'CABEÇA', 'Inclinada - esquerda', '-', 'OMBROSNivelados']

--- Avaliacao Fotos Antes e Depois ---
['AVALIAÇÃO EVOLUTIVA', 'ALUNO:', 'Gabriel', 'Avaliacao 1', 'Avaliacao 2', 'Avaliacao 6', 'Avaliacao 4', 'Avaliacao 5', 'Lateral', 'Frontal', 'Data:', 'Tras', 'Avaliacao 3']

--- Planilha2 ---
['AVALIACAO', 'Avaliacao 2']


```

```python
import pandas as pd
import json

file_path = "Ficha Gabriel Alves v6 - Copia.xlsx"
xls = pd.ExcelFile(file_path)

summary = {}
for sheet in xls.sheet_names:
    try:
        df = pd.read_excel(xls, sheet_name=sheet, header=None)
        text_cells = []
        for col in df.columns:
            for cell in df[col].dropna():
                if isinstance(cell, str) and cell.strip():
                    text_cells.append(cell.strip())
        
        # Get unique texts preserving order somewhat
        seen = set()
        unique_texts = [x for x in text_cells if not (x in seen or seen.add(x))]
        summary[sheet] = unique_texts[:40]
    except Exception as e:
        summary[sheet] = f"Error: {e}"

print(json.dumps(summary, indent=2, ensure_ascii=False))

```

```text
{
  "Observações": [
    "Data",
    "Observações",
    "Objetivos:",
    "Lesões mais graves:",
    "Avaliações:",
    "Treino atual",
    "Disponibilidade de treinos"
  ],
  "Pivot": [
    "GRUPO MUSCULAR",
    "Rótulos de Linha",
    "FLEXÃO BRAÇOS FECHADA",
    "TRÍCEPS COICE UNILATERAL",
    "TRÍCEPS FRANCÊS DUMBBELL",
    "TRÍCEPS FRANCÊS POLIA CORDA",
    "TRÍCEPS FRANCÊS POLIA UNILATERAL",
    "TRÍCEPS FRANCÊS UNILATERAL",
    "TRÍCEPS POLIA BARRA RETA",
    "TRÍCEPS POLIA BARRA RETA INVERTIDO",
    "TRÍCEPS POLIA CORDA",
    "TRÍCEPS POLIA UNILATERAL",
    "TRÍCEPS TESTA BARRA \"H\"",
    "TRICEPS TESTA BARRA RETA",
    "TRÍCEPS TESTA POLIA BARRA RETA",
    "TRÍCEPS TESTA POLIA CORDA",
    "TRÍCEPS TESTA POLIA UNILATERAL",
    "TRÍCEPS TESTA TRX",
    "Total Geral",
    "TRÍCEPS"
  ],
  "Uso interno": [
    "GRUPO MUSCULAR",
    "FUNÇÃO UNIQUE",
    "GOOGLE PLANILHAS",
    "QUADRÍCEPS",
    "GLÚTEO MÁXIMO",
    "LOMBAR",
    "TRÍCEPS",
    "PEITORAL",
    "ISQUIOSSURAIS",
    "GÊMEOS",
    "OMBRO",
    "GLÚTEO MÉDIO",
    "ABS",
    "COSTAS",
    "BÍCEPS",
    "TRAPÉZIO",
    "TIBIAL",
    "ABDOMINAL MÃO ESPALDAR",
    "ABDOMINAL MÁQUINA",
    "ABDOMINAL POLIA CORDA",
    "ABDOMINAL RODINHA",
    "ABDOMINAL SOLO",
    "PERDIGUEIRO DINÂMICO",
    "PERDIGUEIRO ESTÁTICO",
    "PRANCHA VENTRAL",
    "ADUTOR",
    "ADUÇÃO CANELEIRA SOLO",
    "ADUÇÃO POLIA",
    "CADEIRA ADUTORA",
    "CADEIRA ADUTORA 45",
    "ROSCA \"T\" POLIA",
    "ROSCA ALTERNADA",
    "ROSCA CONCENTRADO",
    "ROSCA DIRETA",
    "ROSCA DIRETA BARRA \"W\"",
    "ROSCA DIRETA DUMBBELL",
    "ROSCA DIRETA DUMBBELL BANCO 45",
    "ROSCA DIRETA INVERTIDA",
    "ROSCA DIRETA POLIA BARRA RETA",
    "ROSCA DIRETA POLIA CÓCORAS"
  ],
  "Tabelas %G": [
    "% de gordura para crianças e adolescentes (7 a 17 anos de idade)",
    "Excessivamente Baixa",
    "Baixa",
    "Adequada",
    "Moderadamente Alta",
    "Alta",
    "Excessivamente Alta",
    "Fonte: Lohman, 1987",
    "Meninos",
    "Até 6",
    "6 a 10",
    "10 a 20",
    "20 a 25",
    "25 a 31",
    "Acima de 31",
    "Meninas",
    "Até 12",
    "12 a 15",
    "15 a 25",
    "25 a 30",
    "30 a 36",
    "Acima de 36",
    "% de gordura para Mulheres",
    "Nível /Idade",
    "Excelente",
    "Bom",
    "Abaixo da Média",
    "Média",
    "Acima da Média",
    "Ruim",
    "Muito Ruim",
    "Fonte: Pollock & Wilmore, 1993",
    "% de gordura para Homens",
    "18 - 25",
    "13 a 16",
    "17 a 19",
    "20 a 22",
    "23 a 25",
    "26 a 28",
    "29 a 31"
  ],
  "Rotina": [
    "Horário",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo"
  ],
  "Menu": [
    "ALUNO:",
    "SEXO:",
    "PESO (kg):",
    "ALTURA (m):",
    "IMC (kg/m²):",
    "DATA DE NASCIMENTO:",
    "DATA DA AVALIAÇÃO:",
    "Informações Sobre Tempo Contrato",
    "Plano adiquirido:",
    "Data de Inicio:",
    "Data do Fim:",
    "Valor:",
    "Informações Sobre o Aluno",
    "Dores e Intensidade:",
    "Principais objetivo:",
    "Principais Limitação:",
    "Referencia de Objetivo:",
    "Pontos fracos:",
    "Pontos fortes:",
    "Exercicios Proibidos:",
    "Metodos Utilizados:",
    "REPETIÇÕES FORÇADAS ou ROUBADA",
    "\"DROP-SET\" OU REGRESSIVO ou EXAUSTÃO",
    "EXCÊNTRICO ou NEGATIVO",
    "CONCENTRADO",
    "INSISTÊNCIA ou BOMBEADA",
    "DIVISÃO DOS MOVIMENTOS",
    "SUSTENTAÇÃO ou ISOMÉTRICO",
    "TEMPO SOB TENSÃO (\"TRAINING TO FAILURE\")",
    "PIRÂMIDE CRESCENTE",
    "PIRÂMIDE DECRESCENTE",
    "PIRÂMIDE TRUNCADA",
    "SUPER-SÉRIES (BI, TRI, POLI SET) ou CIRCUITOS",
    "CONTRASTES",
    "PLIOMÉTRICO",
    "PAUSA",
    "SUPERLENTO ou \"SUPER-SLOW\"",
    "PRIORIDADE MUSCULAR",
    "SÉRIE GIGANTE",
    "PICO DE CONTRAÇÃO"
  ],
  "Avaliação Presencial": [
    "AVALIAÇÃO PRESENCIAL",
    "ALUNO:",
    "SEXO:",
    "DATA DE NASCIMENTO:",
    "Gabriel",
    "MASCULINO",
    "SEÇÃO DE ANÁLISE",
    "DATA:",
    "INTERVALO ENTRE AS AVALICOES:",
    "IDADE:",
    "HORARIO:",
    "CIRCUNFERENCIA",
    "Pescoco",
    "Ombros",
    "Tórax Expirando",
    "Tórax Inspirando",
    "Braço direito Relaxado",
    "Braço direito Contraido",
    "Braço esquerdo Relaxado",
    "Braço esquerdo Contraido",
    "Abdominal",
    "Cintura",
    "Quadril",
    "Coxa Direita Proximal (Dobra Glutea)",
    "Coxa Direita Medial (20 cm do bordo superior da patela)",
    "Coxa Direita Distal",
    "Coxa Esquerda Proximal (Dobra Glutea)",
    "Coxa Esquerda Medial (20 cm do bordo superior da patela)",
    "Coxa Esquerda Distal",
    "Panturrilha direita",
    "Panturrilha esquerda",
    "DOBRAS CUTANEAS",
    "Medida 1 [mm]: Peitoral",
    "Medida 2 [mm]: Axilar média",
    "Medida 3 [mm]: Subescapular",
    "Medida 4 [mm]: Tricipital",
    "Medida 5 [mm]: Bicipital",
    "Medida 6 [mm]: Suprailíaca",
    "Medida 7 [mm]: Abdominal",
    "Medida 8 [mm]: Coxa"
  ],
  "Avaliação Online": [
    "AVALIAÇÃO ONLINE",
    "DATA ---------->",
    "PARTE DO CORPO",
    "Braço direito Relaxado",
    "Braco Direito Contraio",
    "Braço esquerdo Relaxado",
    "Braco Esquerdo Contraio",
    "Ombro",
    "Tórax",
    "Abdominal",
    "Cintura",
    "Quadril",
    "Coxa direita DISTAL",
    "Coxa esquerda DISTAL",
    "Panturrilha direita",
    "Panturrilha esquerda",
    "AV1",
    "AV2",
    "AV3",
    "ALUNO:",
    "AV4",
    "Gabriel",
    "AV5",
    "AV6",
    "AV7",
    "AV8",
    "AV9",
    "AV10",
    "COMO MEDIR →",
    "AVALIAÇÃO COMPARAÇÃO",
    "DATA AVALIAÇÃO",
    "ANÁLISE DOS DADOS",
    "Peso",
    "% gordura",
    "¼",
    "Massa gorda",
    "Braço",
    "Ombro-a-ombro",
    "Coxa",
    "Panturrilha"
  ],
  "Nivel de treinamento": [
    "CALCULADORA",
    "Tempo de treino sem interupção",
    "Destreino",
    "Experiência prévia",
    "Técnica",
    "Valores de força",
    "Total",
    "Média",
    "REFERÊNCIA:",
    "SANTOS JUNIOR, E. R. T. ; SALLES, B. F. ; DIAS, I. ; RIBEIRO, A. S. ; SIMÃO, R. . Classification and Determination Model of Resistance Training Status. STRENGTH AND CONDITIONING JOURNAL, 2021.",
    "Iniciante             (1 ponto)",
    "Intermediário          (2 pontos)",
    "Avançado           (3 pontos)",
    "Ext. avançado           (4 pontos)"
  ],
  "Teste ANAEROBIA": [
    "NÃO MEXER ->",
    "PARTE ANAERÓBIA",
    "Teste de resistência de carga/ 1RM SUPERIORES",
    "Data do teste",
    "Exercício",
    "Supino reto",
    "Puxada frontal",
    "USO INTERNO",
    "EXERCÍCIOS 1RM",
    "Supino inclinado no smith",
    "Desenvolvimento máquina",
    "Supino inclinado",
    "Extensora",
    "Cadeira flexora",
    "Mesa flexora",
    "Agachamento livre com a barra",
    "Leg press 45",
    "Nº de repetições (entre 1 e 15)",
    "Carga (kg)",
    "Link do exercício",
    "%1RM CORRESPONDENTE",
    "-",
    "Nº de repetições",
    "CARGA*100/%1RM",
    "% 1RM",
    "1RM referente ao exercício feito",
    "Teste de resistência de carga/ 1RM INFERIORES"
  ],
  "Teste AEROBIO": [
    "TESTE FÍSICO",
    "PARTE AERÓBIA",
    "TESTE COOPER 12 MIN",
    "Data do teste",
    "Distância percorrida em 12min (m)",
    "VO2 máximo (ml.kg/min)",
    "-",
    "ALUNO:",
    "TESTE INCREMENTAL",
    "Gabriel",
    "Velocidade inicial (km/h)",
    "Duração dos estágios (s)",
    "Incremento de velocidade por estágio (km/h)",
    "Velocidade máxima atingida (km/h)",
    "Nº de estágios atingidos",
    "Duração do teste (min)",
    "OBS",
    "Teste 6 minutos"
  ],
  "Teste ISOMETRICA": [
    "PARTE DE ISOMETRIA",
    "Tempo gasto em segundos",
    "Data do teste",
    "Prancha frontal >60 seg",
    "Prancha lateral direita >45seg",
    "Prancha lateral esquerda >45seg",
    "Teste de Sorensen >60seg",
    "Cadeirinha Bilateral >60seg",
    "Cadeirinha Unilateral Direita >30seg",
    "Cadeirinha Unilateral Esquerda >30seg",
    "Flexao sem apoio >30seg",
    "Flexao com apoio >45seg",
    "Agachamento com peso (20 a 25% PC) >60 seg",
    "PARTE POTENCIA",
    "DATA:",
    "THRUSTER >25REPS                              10 A 20% PC",
    "CARGA KG",
    "TEMPO",
    "TAXA",
    "ABDOMINAL REMADOR",
    "FLEXAO DE BRACO"
  ],
  "Avaliação Postural": [
    "AVALIAÇÃO POSTURAL",
    "COLUNANeutra",
    "OMBROSNivelados",
    "ESCÁPULASNeutras",
    "ESCÁPULASAbduzidas",
    "ESCÁPULAS",
    "PELVE - EIPS",
    "TORNOZELO",
    "COLUNAInclinada - esquerda",
    "COLUNAInclinada - direita",
    "OMBROSElevados",
    "OMBROSDeprimidos",
    "ESCÁPULASAduzidas",
    "ESCÁPULASRotatas - inferior",
    "ESCÁPULASRotatas - superior",
    "ESCÁPULASAladas",
    "PELVE - EIPSNiveladas",
    "PELVE - EIPSDesalinhada - esquerdo",
    "PELVE - EIPSDesalinhada - direito",
    "TORNOZELONeutros",
    "TORNOZELOSupinados",
    "TORNOZELOPronados",
    "VISTA POSTERIOR",
    "PARTE DO CORPO",
    "COLUNA",
    "OMBROS",
    "USO INTERNO",
    "Neutra",
    "Inclinada - esquerda",
    "Inclinada - direita",
    "Nivelados",
    "Elevados",
    "Deprimidos",
    "Neutras",
    "Aduzidas",
    "Abduzidas",
    "Rotatas - inferior",
    "Rotatas - superior",
    "Aladas",
    "Niveladas"
  ],
  "Avaliacao Fotos Antes e Depois": [
    "AVALIAÇÃO EVOLUTIVA",
    "ALUNO:",
    "Avaliacao 1",
    "Data:",
    "Avaliacao 2",
    "Avaliacao 3",
    "Avaliacao 4",
    "Avaliacao 5",
    "Avaliacao 6",
    "Gabriel",
    "Lateral",
    "Frontal",
    "Tras"
  ],
  "Planilha2": [
    "AVALIACAO",
    "Avaliacao 2"
  ]
}


```

```python
import pandas as pd
import warnings
import json
warnings.filterwarnings('ignore')

file_path = "Ficha Gabriel Alves v6 - Copia.xlsx"
xls = pd.ExcelFile(file_path)

summary = {}
for sheet in xls.sheet_names:
    try:
        df = pd.read_excel(xls, sheet_name=sheet, header=None)
        text_cells = []
        for col in df.columns:
            for cell in df[col].dropna():
                if isinstance(cell, str) and cell.strip():
                    text_cells.append(cell.strip())
        
        seen = set()
        unique_texts = [x for x in text_cells if not (x in seen or seen.add(x))]
        summary[sheet] = unique_texts[:25]
    except Exception as e:
        summary[sheet] = f"Error: {e}"

print(json.dumps(summary, indent=2, ensure_ascii=False))

```

```text
{
  "Observações": [
    "Data",
    "Observações",
    "Objetivos:",
    "Lesões mais graves:",
    "Avaliações:",
    "Treino atual",
    "Disponibilidade de treinos"
  ],
  "Pivot": [
    "GRUPO MUSCULAR",
    "Rótulos de Linha",
    "FLEXÃO BRAÇOS FECHADA",
    "TRÍCEPS COICE UNILATERAL",
    "TRÍCEPS FRANCÊS DUMBBELL",
    "TRÍCEPS FRANCÊS POLIA CORDA",
    "TRÍCEPS FRANCÊS POLIA UNILATERAL",
    "TRÍCEPS FRANCÊS UNILATERAL",
    "TRÍCEPS POLIA BARRA RETA",
    "TRÍCEPS POLIA BARRA RETA INVERTIDO",
    "TRÍCEPS POLIA CORDA",
    "TRÍCEPS POLIA UNILATERAL",
    "TRÍCEPS TESTA BARRA \"H\"",
    "TRICEPS TESTA BARRA RETA",
    "TRÍCEPS TESTA POLIA BARRA RETA",
    "TRÍCEPS TESTA POLIA CORDA",
    "TRÍCEPS TESTA POLIA UNILATERAL",
    "TRÍCEPS TESTA TRX",
    "Total Geral",
    "TRÍCEPS"
  ],
  "Uso interno": [
    "GRUPO MUSCULAR",
    "FUNÇÃO UNIQUE",
    "GOOGLE PLANILHAS",
    "QUADRÍCEPS",
    "GLÚTEO MÁXIMO",
    "LOMBAR",
    "TRÍCEPS",
    "PEITORAL",
    "ISQUIOSSURAIS",
    "GÊMEOS",
    "OMBRO",
    "GLÚTEO MÉDIO",
    "ABS",
    "COSTAS",
    "BÍCEPS",
    "TRAPÉZIO",
    "TIBIAL",
    "ABDOMINAL MÃO ESPALDAR",
    "ABDOMINAL MÁQUINA",
    "ABDOMINAL POLIA CORDA",
    "ABDOMINAL RODINHA",
    "ABDOMINAL SOLO",
    "PERDIGUEIRO DINÂMICO",
    "PERDIGUEIRO ESTÁTICO",
    "PRANCHA VENTRAL"
  ],
  "Tabelas %G": [
    "% de gordura para crianças e adolescentes (7 a 17 anos de idade)",
    "Excessivamente Baixa",
    "Baixa",
    "Adequada",
    "Moderadamente Alta",
    "Alta",
    "Excessivamente Alta",
    "Fonte: Lohman, 1987",
    "Meninos",
    "Até 6",
    "6 a 10",
    "10 a 20",
    "20 a 25",
    "25 a 31",
    "Acima de 31",
    "Meninas",
    "Até 12",
    "12 a 15",
    "15 a 25",
    "25 a 30",
    "30 a 36",
    "Acima de 36",
    "% de gordura para Mulheres",
    "Nível /Idade",
    "Excelente"
  ],
  "Rotina": [
    "Horário",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo"
  ],
  "Menu": [
    "ALUNO:",
    "SEXO:",
    "PESO (kg):",
    "ALTURA (m):",
    "IMC (kg/m²):",
    "DATA DE NASCIMENTO:",
    "DATA DA AVALIAÇÃO:",
    "Informações Sobre Tempo Contrato",
    "Plano adiquirido:",
    "Data de Inicio:",
    "Data do Fim:",
    "Valor:",
    "Informações Sobre o Aluno",
    "Dores e Intensidade:",
    "Principais objetivo:",
    "Principais Limitação:",
    "Referencia de Objetivo:",
    "Pontos fracos:",
    "Pontos fortes:",
    "Exercicios Proibidos:",
    "Metodos Utilizados:",
    "REPETIÇÕES FORÇADAS ou ROUBADA",
    "\"DROP-SET\" OU REGRESSIVO ou EXAUSTÃO",
    "EXCÊNTRICO ou NEGATIVO",
    "CONCENTRADO"
  ],
  "Avaliação Presencial": [
    "AVALIAÇÃO PRESENCIAL",
    "ALUNO:",
    "SEXO:",
    "DATA DE NASCIMENTO:",
    "Gabriel",
    "MASCULINO",
    "SEÇÃO DE ANÁLISE",
    "DATA:",
    "INTERVALO ENTRE AS AVALICOES:",
    "IDADE:",
    "HORARIO:",
    "CIRCUNFERENCIA",
    "Pescoco",
    "Ombros",
    "Tórax Expirando",
    "Tórax Inspirando",
    "Braço direito Relaxado",
    "Braço direito Contraido",
    "Braço esquerdo Relaxado",
    "Braço esquerdo Contraido",
    "Abdominal",
    "Cintura",
    "Quadril",
    "Coxa Direita Proximal (Dobra Glutea)",
    "Coxa Direita Medial (20 cm do bordo superior da patela)"
  ],
  "Avaliação Online": [
    "AVALIAÇÃO ONLINE",
    "DATA ---------->",
    "PARTE DO CORPO",
    "Braço direito Relaxado",
    "Braco Direito Contraio",
    "Braço esquerdo Relaxado",
    "Braco Esquerdo Contraio",
    "Ombro",
    "Tórax",
    "Abdominal",
    "Cintura",
    "Quadril",
    "Coxa direita DISTAL",
    "Coxa esquerda DISTAL",
    "Panturrilha direita",
    "Panturrilha esquerda",
    "AV1",
    "AV2",
    "AV3",
    "ALUNO:",
    "AV4",
    "Gabriel",
    "AV5",
    "AV6",
    "AV7"
  ],
  "Nivel de treinamento": [
    "CALCULADORA",
    "Tempo de treino sem interupção",
    "Destreino",
    "Experiência prévia",
    "Técnica",
    "Valores de força",
    "Total",
    "Média",
    "REFERÊNCIA:",
    "SANTOS JUNIOR, E. R. T. ; SALLES, B. F. ; DIAS, I. ; RIBEIRO, A. S. ; SIMÃO, R. . Classification and Determination Model of Resistance Training Status. STRENGTH AND CONDITIONING JOURNAL, 2021.",
    "Iniciante             (1 ponto)",
    "Intermediário          (2 pontos)",
    "Avançado           (3 pontos)",
    "Ext. avançado           (4 pontos)"
  ],
  "Teste ANAEROBIA": [
    "NÃO MEXER ->",
    "PARTE ANAERÓBIA",
    "Teste de resistência de carga/ 1RM SUPERIORES",
    "Data do teste",
    "Exercício",
    "Supino reto",
    "Puxada frontal",
    "USO INTERNO",
    "EXERCÍCIOS 1RM",
    "Supino inclinado no smith",
    "Desenvolvimento máquina",
    "Supino inclinado",
    "Extensora",
    "Cadeira flexora",
    "Mesa flexora",
    "Agachamento livre com a barra",
    "Leg press 45",
    "Nº de repetições (entre 1 e 15)",
    "Carga (kg)",
    "Link do exercício",
    "%1RM CORRESPONDENTE",
    "-",
    "Nº de repetições",
    "CARGA*100/%1RM",
    "% 1RM"
  ],
  "Teste AEROBIO": [
    "TESTE FÍSICO",
    "PARTE AERÓBIA",
    "TESTE COOPER 12 MIN",
    "Data do teste",
    "Distância percorrida em 12min (m)",
    "VO2 máximo (ml.kg/min)",
    "-",
    "ALUNO:",
    "TESTE INCREMENTAL",
    "Gabriel",
    "Velocidade inicial (km/h)",
    "Duração dos estágios (s)",
    "Incremento de velocidade por estágio (km/h)",
    "Velocidade máxima atingida (km/h)",
    "Nº de estágios atingidos",
    "Duração do teste (min)",
    "OBS",
    "Teste 6 minutos"
  ],
  "Teste ISOMETRICA": [
    "PARTE DE ISOMETRIA",
    "Tempo gasto em segundos",
    "Data do teste",
    "Prancha frontal >60 seg",
    "Prancha lateral direita >45seg",
    "Prancha lateral esquerda >45seg",
    "Teste de Sorensen >60seg",
    "Cadeirinha Bilateral >60seg",
    "Cadeirinha Unilateral Direita >30seg",
    "Cadeirinha Unilateral Esquerda >30seg",
    "Flexao sem apoio >30seg",
    "Flexao com apoio >45seg",
    "Agachamento com peso (20 a 25% PC) >60 seg",
    "PARTE POTENCIA",
    "DATA:",
    "THRUSTER >25REPS                              10 A 20% PC",
    "CARGA KG",
    "TEMPO",
    "TAXA",
    "ABDOMINAL REMADOR",
    "FLEXAO DE BRACO"
  ],
  "Avaliação Postural": [
    "AVALIAÇÃO POSTURAL",
    "COLUNANeutra",
    "OMBROSNivelados",
    "ESCÁPULASNeutras",
    "ESCÁPULASAbduzidas",
    "ESCÁPULAS",
    "PELVE - EIPS",
    "TORNOZELO",
    "COLUNAInclinada - esquerda",
    "COLUNAInclinada - direita",
    "OMBROSElevados",
    "OMBROSDeprimidos",
    "ESCÁPULASAduzidas",
    "ESCÁPULASRotatas - inferior",
    "ESCÁPULASRotatas - superior",
    "ESCÁPULASAladas",
    "PELVE - EIPSNiveladas",
    "PELVE - EIPSDesalinhada - esquerdo",
    "PELVE - EIPSDesalinhada - direito",
    "TORNOZELONeutros",
    "TORNOZELOSupinados",
    "TORNOZELOPronados",
    "VISTA POSTERIOR",
    "PARTE DO CORPO",
    "COLUNA"
  ],
  "Avaliacao Fotos Antes e Depois": [
    "AVALIAÇÃO EVOLUTIVA",
    "ALUNO:",
    "Avaliacao 1",
    "Data:",
    "Avaliacao 2",
    "Avaliacao 3",
    "Avaliacao 4",
    "Avaliacao 5",
    "Avaliacao 6",
    "Gabriel",
    "Lateral",
    "Frontal",
    "Tras"
  ],
  "Planilha2": [
    "AVALIACAO",
    "Avaliacao 2"
  ]
}


```

Aqui está o documento de especificação e mapeamento de funcionalidades com base na análise estrutural do arquivo **"Ficha Gabriel Alves v6 - Copia.xlsx"**. Este levantamento detalha todas as abas, tabelas e lógicas de negócios contidas na planilha para facilitar a transposição para a arquitetura do novo sistema.

---

# Documentação Técnica: Sistema de Cadastramento e Avaliação de Alunos

## 1. Visão Geral

O sistema atual baseado na planilha tem como objetivo o gerenciamento completo do ciclo de vida do aluno na consultoria esportiva. Ele abrange desde o cadastro inicial e controle de contratos até o acompanhamento profundo de métricas corporais, testes de performance física (aeróbica, anaeróbica e isométrica) e avaliações posturais.

## 2. Mapeamento de Módulos e Funcionalidades (Por Aba)

### Módulo de Cadastro e Perfil (Aba `Menu` e `Observações`)

Esta é a porta de entrada dos dados do aluno, funcionando como o *Dashboard* de anamnese.

* **Dados Demográficos e Biométricos:** Nome, Sexo, Peso, Altura, IMC, Data de Nascimento e Data da Avaliação.
* **Gestão de Contratos:** Controle de "Plano adquirido", "Data de Início", "Data do Fim" e "Valor".
* **Anamnese e Perfil Físico:** Campos para registro de Dores/Intensidade, Principais Objetivos, Limitações, Referência de Objetivo, Pontos Fracos/Fortes e Exercícios Proibidos.
* **Metodologia Aplicada:** Definição de métodos de treino (Ex: Drop-set, Excêntrico, Repetições Forçadas).
* **Observações Clínicas (`Observações`):** Histórico textual sobre lesões mais graves, treinos atuais e objetivos específicos.

### Módulo de Agendamento e Rotina (Aba `Rotina`)

* **Grade Semanal:** Tabela de horários mapeando a disponibilidade de treinos do aluno de Segunda a Domingo.

### Módulo de Avaliação Antropométrica (Abas `Avaliação Presencial`, `Avaliação Online` e `Tabelas %G`)

Responsável por rastrear as medidas corporais de forma evolutiva.

* **Avaliação Presencial:** Registro detalhado de circunferências (Pescoço, Ombros, Tórax inspirando/expirando, Braços relaxados/contraídos, Abdominal, Cintura, Quadril, Coxa Proximal/Medial, etc.).
* **Avaliação Online:** Uma versão adaptada para consultoria à distância, rastreando medidas de forma cronológica (AV1, AV2 até AV7) para facilitar a visualização da progressão.
* **Tabelas Normativas (`Tabelas %G`):** Tabelas de referência embutidas (baseadas no protocolo de Lohman) para classificar o percentual de gordura de acordo com idade, sexo e nível (Ex: Baixo, Adequado, Alto).

### Módulo de Testes de Performance Física

Subdividido em três áreas centrais para calcular o condicionamento e a progressão de carga do aluno:

* **Teste Anaeróbio (`Teste ANAEROBIA`):** Focado em força. Contém calculadoras de 1RM (Uma Repetição Máxima) para exercícios como Supino, Puxada, Leg Press e Agachamento. Ele calcula a carga ideal baseada no percentual de 1RM correspondente.
* **Teste Aeróbio (`Teste AEROBIO`):** Focado em resistência cardiovascular. Inclui o **Teste de Cooper de 12 minutos** (com cálculo automático de VO2 Máximo), Teste Incremental (velocidade inicial, duração de estágios) e Teste de 6 minutos.
* **Teste de Isometria e Potência (`Teste ISOMETRICA`):** Controle de tempo (em segundos) sob tensão para exercícios como Prancha Frontal/Lateral, Teste de Sorensen, Cadeirinha, além de testes de repetição para potência (Ex: Thruster, Abdominal Remador e Flexão de braço).

### Módulo de Classificação de Nível (Aba `Nivel de treinamento`)

* **Calculadora de Experiência:** Um sistema de pontuação fundamentado em literatura científica (Santos Junior et al., 2021) que avalia Tempo de treino, Destreino, Experiência prévia, Técnica e Força. O resultado classifica o aluno automaticamente como: *Iniciante, Intermediário, Avançado* ou *Extremamente Avançado*.

### Módulo Clínico e Visual (Abas `Avaliação Postural` e `Avaliacao Fotos Antes e Depois`)

* **Avaliação Postural:** Formulário estruturado de análise visual detalhando alinhamentos da Coluna (Neutra, Inclinada), Ombros (Nivelados, Elevados, Deprimidos), Escápulas (Aladas, Abduzidas, etc.), Pelve e Tornozelos (Pronados, Supinados).
* **Galeria Evolutiva (Fotos):** Grade preparada para receber imagens Frontais, Laterais e Traseiras acompanhando as datas das avaliações cronológicas.

### Bancos de Dados Auxiliares (Abas `Uso interno` e `Pivot`)

* **Relação Músculo x Exercício:** Matrizes de dados que categorizam listas completas de exercícios (Ex: Tríceps Testa, Abdominal Rodinha, etc.) em seus respectivos agrupamentos musculares (Quadríceps, Glúteo, Peitoral). Isso é utilizado na planilha para gerar menus suspensos (*dropdowns*) dinâmicos.

---

## 3. Estruturação para o Novo Sistema

Para converter toda essa inteligência de dados em uma plataforma web moderna, utilizando uma arquitetura robusta no back-end, o banco de dados precisará ser relacional e altamente estruturado.

Abaixo está uma sugestão de como os módulos desta planilha podem ser modelados utilizando o **Prisma ORM**, perfeitamente integrável com frameworks como Next.js, para sustentar todas as funcionalidades levantadas:

```prisma
// Exemplo de Modelagem Base - Prisma ORM

model Aluno {
  id               String   @id @default(uuid())
  nome             String
  sexo             String
  dataNascimento   DateTime
  peso             Float
  altura           Float
  imc              Float
  
  // Relações
  contrato         Contrato?
  anamnese         Anamnese?
  rotina           RotinaSemanal[]
  avaliacoesCorpo  AvaliacaoAntropometrica[]
  testesFisicos    TesteFisico[]
  fotosEvolutivas  FotoEvolutiva[]
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model Contrato {
  id               String   @id @default(uuid())
  alunoId          String   @unique
  aluno            Aluno    @relation(fields: [alunoId], references: [id])
  plano            String
  dataInicio       DateTime
  dataFim          DateTime
  valor            Float
}

model Anamnese {
  id                   String   @id @default(uuid())
  alunoId              String   @unique
  aluno                Aluno    @relation(fields: [alunoId], references: [id])
  objetivos            String
  limitacoes           String
  doresIntensidade     String
  exerciciosProibidos  String
  nivelTreinamento     String   // Iniciante, Intermediário, Avançado
}

model AvaliacaoAntropometrica {
  id               String   @id @default(uuid())
  alunoId          String
  aluno            Aluno    @relation(fields: [alunoId], references: [id])
  tipo             String   // "Presencial" ou "Online"
  dataAvaliacao    DateTime
  
  // Medidas
  torax            Float?
  bracoDireito     Float?
  bracoEsquerdo    Float?
  cintura          Float?
  abdome           Float?
  quadril          Float?
  coxa             Float?
  
  createdAt        DateTime @default(now())
}

model TesteFisico {
  id               String   @id @default(uuid())
  alunoId          String
  aluno            Aluno    @relation(fields: [alunoId], references: [id])
  tipoTeste        String   // "AEROBIO", "ANAEROBIO", "ISOMETRIA"
  dataTeste        DateTime
  
  // Metadados flexíveis armazenados em JSON para lidar com a variedade de testes
  resultados       Json     
}

```

### Recomendações de Interface (Front-end)

* **Tabelas de Referência:** Toda a aba de `Uso interno` e `Pivot` (agrupamentos musculares e listas de exercícios) pode ser transformada em constantes ou dados fixos no banco (tabelas de domínio), permitindo a criação de *Selects* combinados limpos na interface final, onde o usuário seleciona o grupo muscular e a interface renderiza apenas os exercícios daquela categoria.
* **Cálculos em Tempo Real:** Fórmulas vitais como o cálculo de **VO2 Máximo**, **Índice de 1RM** e a **Classificação de Nível de Treinamento** podem ser extraídas diretamente para funções utilitárias em TypeScript. Assim que o cliente inserir os valores no painel (por exemplo, "Distância percorrida no teste de 12 min"), a interface devolverá o resultado na mesma hora.
* **Fotos Antes/Depois:** As avaliações evolutivas podem ser gerenciadas visualmente utilizando componentes de grade no Tailwind CSS para criar visualizações comparativas automáticas para o cliente final.