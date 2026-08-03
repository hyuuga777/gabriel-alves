/**
 * Fórmulas de Predição de 1RM (Uma Repetição Máxima)
 * Utilizando a fórmula de Brzycki padronizada
 * 1RM = Carga / (1.0278 - (0.0278 * Repetições))
 */
export function calculate1RM(weight: number, reps: number): number {
    if (reps <= 0 || weight <= 0) return 0;
    if (reps === 1) return weight;
    return weight / (1.0278 - (0.0278 * reps));
}

/**
 * Retorna a carga ideal para um dado % de 1RM
 */
export function calculateTargetWeight(oneRM: number, targetPercentage: number): number {
    return (oneRM * targetPercentage) / 100;
}

/**
 * VO2 Máximo - Teste de Cooper (12 minutos)
 * Fórmula: (Distância(m) - 504.9) / 44.73
 */
export function calculateCooperVO2Max(distanceInMeters: number): number {
    if (distanceInMeters <= 0) return 0;
    return (distanceInMeters - 504.9) / 44.73;
}

/**
 * Densidade Corporal - Jackson & Pollock 3 Dobras
 * Homens: Peitoral, Abdômen, Coxa
 * Mulheres: Tríceps, Suprailíaca, Coxa
 */
export function calculateBodyDensity3Dobras(
    gender: 'M' | 'F',
    age: number,
    fold1: number, // Homem: Peitoral | Mulher: Tríceps
    fold2: number, // Homem: Abdômen  | Mulher: Suprailíaca
    fold3: number  // Homem: Coxa     | Mulher: Coxa
): number {
    const sumFolds = fold1 + fold2 + fold3;
    
    if (gender === 'M') {
        return 1.10938 - (0.0008267 * sumFolds) + (0.0000016 * Math.pow(sumFolds, 2)) - (0.0002574 * age);
    } else {
        return 1.0994921 - (0.0009929 * sumFolds) + (0.0000023 * Math.pow(sumFolds, 2)) - (0.0001392 * age);
    }
}

/**
 * Percentual de Gordura - Equação de Siri
 * %G = ((4.95 / Densidade Corporal) - 4.50) * 100
 */
export function calculateBodyFatSiri(density: number): number {
    return ((4.95 / density) - 4.50) * 100;
}

/**
 * Classificação do Percentual de Gordura
 * Baseado nas tabelas normativas de Lohman / Pollock 
 */
export function classifyBodyFat(gender: 'M' | 'F', age: number, bodyFat: number): string {
    // Simplificação de classificação para adultos (> 17 anos) baseada nas normativas gerais
    // Estes valores podem ser expandidos conforme a tabela exata da planilha
    if (gender === 'M') {
        if (bodyFat <= 6) return 'Excessivamente Baixa';
        if (bodyFat <= 10) return 'Baixa';
        if (bodyFat <= 20) return 'Adequada';
        if (bodyFat <= 25) return 'Moderadamente Alta';
        if (bodyFat <= 31) return 'Alta';
        return 'Excessivamente Alta';
    } else {
        if (bodyFat <= 12) return 'Excessivamente Baixa';
        if (bodyFat <= 15) return 'Baixa';
        if (bodyFat <= 25) return 'Adequada';
        if (bodyFat <= 30) return 'Moderadamente Alta';
        if (bodyFat <= 36) return 'Alta';
        return 'Excessivamente Alta';
    }
}

/**
 * Calculadora de Nível de Treinamento
 * Baseado em Santos Junior et al., 2021
 * Pontuação total:
 * 5-7: Iniciante
 * 8-11: Intermediário
 * 12-15: Avançado
 * 16-20: Ext. Avançado
 */
export function calculateTrainingLevel(
    tempoTreino: number, // 1 a 4
    destreino: number,   // 1 a 4
    experiencia: number, // 1 a 4
    tecnica: number,     // 1 a 4
    forca: number        // 1 a 4
): { score: number, classification: string } {
    const score = tempoTreino + destreino + experiencia + tecnica + forca;
    let classification = 'Iniciante';
    
    if (score >= 16) classification = 'Extremamente Avançado';
    else if (score >= 12) classification = 'Avançado';
    else if (score >= 8) classification = 'Intermediário';
    
    return { score, classification };
}
