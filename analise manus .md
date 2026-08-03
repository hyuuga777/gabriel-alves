# Referência de Fórmulas - TEAM ALVES

## 📌 Status Atual

As fórmulas implementadas atualmente são baseadas em **protocolos científicos padrão**. Este documento lista o que está implementado e o que precisa ser substituído pelas fórmulas específicas da TEAM ALVES.

---

## 1. Composição Corporal

### Dobras Cutâneas

**Implementado Atualmente:**
- Protocolo: Jackson & Pollock (3 dobras)
- Homens: Tórax, Abdômen, Coxa
- Mulheres: Tríceps, Suprailíaca, Coxa

**Fórmulas:**
```ts
// Homens
soma3Dobras = triceps + abdomen + coxa
densidadeCorporal = 1.10938 - (0.0008267 × soma3Dobras) + 
                   (0.0000016 × soma3Dobras²) - (0.0002574 × idade)

// Mulheres
soma3Dobras = triceps + suprailiaca + coxa
densidadeCorporal = 1.0994921 - (0.0009929 × soma3Dobras) + 
                   (0.0000023 × soma3Dobras²) - (0.0001392 × idade)

// Conversão para % Gordura (Fórmula de Siri)
percentualGordura = ((4.95 / densidadeCorporal) - 4.50) × 100
```

**⚠️ SUBSTITUIR POR:**
- Protocolo TEAM ALVES (especificar quais dobras)
- Fórmulas específicas para cada protocolo
- Tabelas de classificação

---

## 2. Testes de Performance

### VO2 Máx (Teste de Cooper)

**Implementado Atualmente:**
```ts
VO2max = (distânciaMetros - 504.9) / 44.73
```

**⚠️ CONFIRMAR:**
- Esta fórmula está correta para TEAM ALVES?
- Existem outras fórmulas de VO2 usadas? (Balke, Rockport, etc.)

---

### METS (Equivalentes Metabólicos)

**Implementado Atualmente:**
```ts
METS = VO2max / 3.5
```
(Padrão internacional: 1 MET = 3.5 ml/kg/min)

**⚠️ CONFIRMAR:**
- Fórmula correta ou há ajustes específicos?

---

### Gasto Calórico

**Implementado Atualmente:**
```ts
calorias = METs × peso(kg) × tempo(horas)
```

**⚠️ CONFIRMAR:**
- Fórmula correta?
- Há fatores de correção adicionais?

---

## 3. Avaliação Funcional

### Mobilidade
**❓ NECESSÁRIO:**
- Checklist de pontos a avaliar
- Critérios de classificação (normal/limitado/etc)
- Pontuação ou sistema de scoring

### Encurtamentos Musculares
**❓ NECESSÁRIO:**
- Quais grupos musculares avaliar?
- Como medir/pontuar?

### Postura
**❓ NECESSÁRIO:**
- Protocolo de análise postural
- Pontos de referência
- Sistema de classificação

### Assimetrias
**Implementado Atualmente:**
```ts
diferença = abs(ladoD - ladoE)
percentual = (diferença / max(ladoD, ladoE)) × 100
status = percentual > 10 ? "Significativa" : "Normal"
```

**⚠️ CONFIRMAR:**
- Limite de 10% está correto?
- Há outros critérios?

---

## 4. Testes de Força

### Força Máxima (1RM)
**❓ NECESSÁRIO:**
- Como são registrados os testes?
- Fórmulas de estimativa de 1RM (se aplicável)?
- Tabelas de classificação por idade/peso/gênero

### Potência Isométrica
**❓ NECESSÁRIO:**
- Protocolo de teste
- Unidades de medida
- Critérios de comparação D/E

---

## 5. Bioimpedância

**Campos Disponíveis no Schema:**
```json
{
  "massaMagra": number,
  "massaGorda": number,
  "aguaCorporal": number,
  "massaOssea": number
}
```

**❓ NECESSÁRIO:**
- Os aparelhos fornecem esses dados automaticamente?
- Há cálculos adicionais a fazer?
- Há correções/fatores de ajuste?

---

## 6. Perímetros (Circunferências)

**Campos Disponíveis:**
- Abdômen
- Braço D/E
- Perna D/E
- Cintura
- Quadril

**Implementado:**
- Detecção automática de assimetria (braços e pernas)

**❓ NECESSÁRIO:**
- Há outras medidas importantes?
- Cálculos derivados? (ex: relação cintura/quadril)

---

## 7. IMC (Índice de Massa Corporal)

**Implementado:**
```ts
IMC = peso(kg) / altura(m)²

Classificação:
< 18.5: Abaixo do Peso
18.5-24.9: Peso Normal
25-29.9: Sobrepeso
30-34.9: Obesidade Grau I
35-39.9: Obesidade Grau II
≥ 40: Obesidade Grau III
```

**⚠️ CONFIRMAR:**
- Classificação está alinhada com TEAM ALVES?

---

## 8. Classificação de Condição Física (VO2)

**Implementado:**
Tabelas simplificadas por idade e gênero baseadas em ACSM

**⚠️ SUBSTITUIR POR:**
- Tabelas completas da TEAM ALVES
- Todas as faixas etárias
- Ambos os gêneros

---

## 9. Relatórios Comparativos

**Implementado:**
```ts
{
  peso: { diferença, percentual },
  percentualGordura: { diferença, pontos },
  vo2Max: { diferença, percentual }
}
```

**❓ NECESSÁRIO:**
- Há outros indicadores para comparação?
- Formato específico de relatório PDF?
- Gráficos específicos a incluir?

---

## 📝 Como Fornecer as Fórmulas

Por favor, forneça:

1. **Planilha TEAM ALVES** (Excel/Google Sheets)
   - Com todas as fórmulas visíveis
   - Exemplos de cálculos
   
2. **Ou Documentação Detalhada:**
   - Protocolo de dobras cutâneas usado
   - Fórmulas exatas para cada cálculo
   - Tabelas de classificação
   - Critérios de avaliação funcional

3. **Exemplo de Relatório Final**
   - Para entender o formato desejado
   - Quais métricas destacar
   - Layout preferido

---

## 🔄 Processo de Atualização

Quando as fórmulas forem fornecidas:

1. ✅ Atualizar `src/lib/assessment-engine.ts`
2. ✅ Adicionar testes de validação
3. ✅ Comparar resultados com planilha original
4. ✅ Documentar diferenças (se houver)
5. ✅ Atualizar interfaces de avaliação

---

## 📧 Contato

Assim que tiver a planilha ou as fórmulas, basta enviar que faço a atualização imediata! 🚀
