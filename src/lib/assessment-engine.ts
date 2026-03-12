/**
 * Engine de Cálculos de Avaliação Física — TEAM ALVES
 *
 * Protocolos implementados:
 *  - Jackson & Pollock 3 dobras (J&P 1978 / J&P & Ward 1980)
 *  - Jackson & Pollock 7 dobras (J&P 1978 / J&P & Ward 1980)
 *  - Equação de Siri (495/d - 450) para % de gordura
 *  - VO2 Max: Cooper 12 min e Rockport 1 milha
 *  - METS e Gasto Calórico
 *  - Assimetrias bilaterais
 *  - Wrapper assíncrono (não bloqueia o event loop)
 */

interface BioimpedanciaData {
    massaMagra: number;
    massaGorda: number;
    aguaCorporal: number;
    massaOssea: number;
}

interface DobrasCutaneasData {
    triceps?: number;
    subescapular?: number;
    biceps?: number;
    suprailiaca?: number;
    abdomen?: number;
    coxa?: number;
    panturrilha?: number;
}

interface PerimetrosData {
    abdomen: number;
    bracoD: number;
    bracoE: number;
    pernaD: number;
    pernaE: number;
    cintura?: number;
    quadril?: number;
}

export class AssessmentEngine {

    /**
     * Calcula percentual de gordura usando protocolo de dobras cutâneas
     * Protocolo: Jackson & Pollock (3 dobras)
     */
    static calcularPercentualGordura(
        dobras: DobrasCutaneasData,
        idade: number,
        genero: 'M' | 'F'
    ): number {
        let densidadeCorporal: number;

        if (genero === 'M') {
            // Homens: tórax, abdômen, coxa
            const soma3Dobras = (dobras.triceps || 0) + (dobras.abdomen || 0) + (dobras.coxa || 0);
            densidadeCorporal = 1.10938 - (0.0008267 * soma3Dobras) +
                (0.0000016 * Math.pow(soma3Dobras, 2)) -
                (0.0002574 * idade);
        } else {
            // Mulheres: tríceps, suprailíaca, coxa
            const soma3Dobras = (dobras.triceps || 0) + (dobras.suprailiaca || 0) + (dobras.coxa || 0);
            densidadeCorporal = 1.0994921 - (0.0009929 * soma3Dobras) +
                (0.0000023 * Math.pow(soma3Dobras, 2)) -
                (0.0001392 * idade);
        }

        // Equação de Siri: %G = (495 / d) - 450
        const percentualGordura = (495 / densidadeCorporal) - 450;
        return parseFloat(Math.max(0, Math.min(60, percentualGordura)).toFixed(2));
    }

    /**
     * Calcula VO2 Máx baseado no teste de Cooper (12 minutos)
     * Fórmula: VO2max = (distância em metros - 504.9) / 44.73
     */
    static calcularVO2MaxCooper(distanciaMetros: number): number {
        const vo2Max = (distanciaMetros - 504.9) / 44.73;
        return parseFloat(vo2Max.toFixed(2));
    }

    /**
     * Calcula METS (Equivalentes Metabólicos)
     * 1 MET = 3.5 ml/kg/min (consumo de O2 em repouso)
     */
    static calcularMETS(vo2Max: number): number {
        const mets = vo2Max / 3.5;
        return parseFloat(mets.toFixed(2));
    }

    /**
     * Estima gasto calórico durante exercício
     * Fórmula: Kcal = METs × peso (kg) × tempo (horas)
     */
    static calcularGastoCalorico(
        mets: number,
        pesoKg: number,
        duracaoMinutos: number
    ): number {
        const calorias = mets * pesoKg * (duracaoMinutos / 60);
        return parseFloat(calorias.toFixed(2));
    }

    /**
     * Calcula percentual de VO2 Max (%VO2)
     * Usado para prescrição de intensidade de treino
     */
    static calcularPercentVO2(
        vo2Atual: number,
        vo2Max: number
    ): number {
        const percent = (vo2Atual / vo2Max) * 100;
        return parseFloat(percent.toFixed(2));
    }

    /**
     * Detecta assimetrias bilaterais
     * Diferença > 10% pode indicar desequilíbrio muscular
     */
    static detectarAssimetrias(perimetros: PerimetrosData): {
        bracos: { diferenca: number; percentual: number; status: string };
        pernas: { diferenca: number; percentual: number; status: string };
    } {
        const diferencaBracos = Math.abs(perimetros.bracoD - perimetros.bracoE);
        const percentualBracos = (diferencaBracos / Math.max(perimetros.bracoD, perimetros.bracoE)) * 100;

        const diferencaPernas = Math.abs(perimetros.pernaD - perimetros.pernaE);
        const percentualPernas = (diferencaPernas / Math.max(perimetros.pernaD, perimetros.pernaE)) * 100;

        return {
            bracos: {
                diferenca: parseFloat(diferencaBracos.toFixed(2)),
                percentual: parseFloat(percentualBracos.toFixed(2)),
                status: percentualBracos > 10 ? 'Assimetria Significativa' : 'Normal'
            },
            pernas: {
                diferenca: parseFloat(diferencaPernas.toFixed(2)),
                percentual: parseFloat(percentualPernas.toFixed(2)),
                status: percentualPernas > 10 ? 'Assimetria Significativa' : 'Normal'
            }
        };
    }

    /**
     * Gera resumo de evolução comparando duas avaliações
     */
    static gerarEvolucao(
        avaliacaoAtual: any,
        avaliacaoAnterior: any | null
    ) {
        if (!avaliacaoAnterior) {
            return null;
        }

        return {
            peso: {
                diferenca: avaliacaoAtual.peso - avaliacaoAnterior.peso,
                percentual: ((avaliacaoAtual.peso - avaliacaoAnterior.peso) / avaliacaoAnterior.peso) * 100
            },
            percentualGordura: avaliacaoAtual.percentualGordura && avaliacaoAnterior.percentualGordura ? {
                diferenca: avaliacaoAtual.percentualGordura - avaliacaoAnterior.percentualGordura,
                pontos: avaliacaoAtual.percentualGordura - avaliacaoAnterior.percentualGordura
            } : null,
            vo2Max: avaliacaoAtual.vo2Max && avaliacaoAnterior.vo2Max ? {
                diferenca: avaliacaoAtual.vo2Max - avaliacaoAnterior.vo2Max,
                percentual: ((avaliacaoAtual.vo2Max - avaliacaoAnterior.vo2Max) / avaliacaoAnterior.vo2Max) * 100
            } : null
        };
    }

    /**
     * Classifica condição física baseada em VO2 Max
     * Tabelas do American College of Sports Medicine (ACSM)
     */
    static classificarCondicaoFisica(
        vo2Max: number,
        idade: number,
        genero: 'M' | 'F'
    ): string {
        // Simplificado - Tabelas completas devem ser adicionadas
        if (genero === 'M') {
            if (idade < 30) {
                if (vo2Max > 55) return 'Excelente';
                if (vo2Max > 50) return 'Muito Bom';
                if (vo2Max > 45) return 'Bom';
                if (vo2Max > 40) return 'Regular';
                return 'Fraco';
            } else if (idade < 40) {
                if (vo2Max > 52) return 'Excelente';
                if (vo2Max > 47) return 'Muito Bom';
                if (vo2Max > 42) return 'Bom';
                if (vo2Max > 37) return 'Regular';
                return 'Fraco';
            } else {
                if (vo2Max > 48) return 'Excelente';
                if (vo2Max > 43) return 'Muito Bom';
                if (vo2Max > 38) return 'Bom';
                if (vo2Max > 33) return 'Regular';
                return 'Fraco';
            }
        } else {
            if (idade < 30) {
                if (vo2Max > 48) return 'Excelente';
                if (vo2Max > 43) return 'Muito Bom';
                if (vo2Max > 38) return 'Bom';
                if (vo2Max > 33) return 'Regular';
                return 'Fraco';
            } else if (idade < 40) {
                if (vo2Max > 45) return 'Excelente';
                if (vo2Max > 40) return 'Muito Bom';
                if (vo2Max > 35) return 'Bom';
                if (vo2Max > 30) return 'Regular';
                return 'Fraco';
            } else {
                if (vo2Max > 42) return 'Excelente';
                if (vo2Max > 37) return 'Muito Bom';
                if (vo2Max > 32) return 'Bom';
                if (vo2Max > 27) return 'Regular';
                return 'Fraco';
            }
        }
    }

    /**
     * Calcula IMC (Índice de Massa Corporal)
     */
    static calcularIMC(pesoKg: number, alturaMetros: number): number {
        const imc = pesoKg / Math.pow(alturaMetros, 2);
        return parseFloat(imc.toFixed(2));
    }

    /**
     * Classifica IMC
     */
    static classificarIMC(imc: number): string {
        if (imc < 18.5) return 'Abaixo do Peso';
        if (imc < 25) return 'Peso Normal';
        if (imc < 30) return 'Sobrepeso';
        if (imc < 35) return 'Obesidade Grau I';
        if (imc < 40) return 'Obesidade Grau II';
        return 'Obesidade Grau III';
    }

    // ── Jackson & Pollock 7 dobras ─────────────────────────────────────────

    /**
     * Densidade via JP 7 dobras (equação original J&P 1978 / J&P & Ward 1980).
     *
     * Dobras necessárias (em mm):
     * - Masc: peitoral, axilar médio, tríceps, subescapular, abdominal, suprailiaco, coxa
     * - Fem: mesmas 7 dobras (equação feminina)
     */
    static calcularDensidadeJP7(
        dobras: {
            peitoral: number;
            axilarMedio: number;
            triceps: number;
            subescapular: number;
            abdominal: number;
            suprailiaco: number;
            coxa: number;
        },
        genero: 'M' | 'F',
        idade: number
    ): number {
        const S =
            dobras.peitoral +
            dobras.axilarMedio +
            dobras.triceps +
            dobras.subescapular +
            dobras.abdominal +
            dobras.suprailiaco +
            dobras.coxa;

        if (genero === 'M') {
            return 1.112 - 0.00043499 * S + 0.00000055 * S ** 2 - 0.00028826 * idade;
        } else {
            return 1.097 - 0.00046971 * S + 0.00000056 * S ** 2 - 0.00012828 * idade;
        }
    }

    /**
     * Percentual de gordura via JP 7 dobras (aplica Siri internamente).
     */
    static calcularPercentualGorduraJP7(
        dobras: Parameters<typeof AssessmentEngine.calcularDensidadeJP7>[0],
        genero: 'M' | 'F',
        idade: number
    ): number {
        const d = AssessmentEngine.calcularDensidadeJP7(dobras, genero, idade);
        const pct = (495 / d) - 450;
        return parseFloat(Math.max(0, Math.min(60, pct)).toFixed(2));
    }

    // ── VO2 Max — Teste de Rockport (1 milha) ─────────────────────────────

    /**
     * Estima VO2 Max via Teste de Caminhada de Rockport.
     * @param tempoMinutos  Tempo em minutos para completar 1 milha (~1,6 km)
     * @param fcFinal       Frequência cardíaca ao término (bpm)
     * @param pesoKg        Peso corporal em kg
     * @param genero        'M' ou 'F'
     * @param idade         Idade em anos
     */
    static calcularVO2MaxRockport(
        tempoMinutos: number,
        fcFinal: number,
        pesoKg: number,
        genero: 'M' | 'F',
        idade: number
    ): number {
        const pesoLbs = pesoKg * 2.20462;
        const sexoNum = genero === 'M' ? 1 : 0;
        const vo2 =
            132.853 -
            0.0769 * pesoLbs -
            0.3877 * idade +
            6.315 * sexoNum -
            3.2649 * tempoMinutos -
            0.1565 * fcFinal;
        return parseFloat(Math.max(0, vo2).toFixed(2));
    }

    // ── Classificação de Gordura Corporal ─────────────────────────────────

    /**
     * Classifica o percentual de gordura pelo padrão ACSM.
     */
    static classificarPercentualGordura(pct: number, genero: 'M' | 'F'): string {
        if (genero === 'M') {
            if (pct < 6) return 'Essencial';
            if (pct < 14) return 'Atlético';
            if (pct < 18) return 'Fitness';
            if (pct < 25) return 'Média';
            return 'Acima da Média';
        } else {
            if (pct < 14) return 'Essencial';
            if (pct < 21) return 'Atlético';
            if (pct < 25) return 'Fitness';
            if (pct < 32) return 'Média';
            return 'Acima da Média';
        }
    }
}

// ── Wrapper assíncrono (non-blocking) ────────────────────────────────────────

export type AssessmentInputAsync = {
    genero: 'M' | 'F';
    idade: number;
    pesoKg: number;
    protocolo: 'JP3' | 'JP7';
    dobrasJP3M?: { peitoral: number; abdominal: number; coxa: number };
    dobrasJP3F?: { triceps: number; suprailiaca: number; coxa: number };
    dobrasJP7?: Parameters<typeof AssessmentEngine.calcularDensidadeJP7>[0];
    cooperDistanciaM?: number;
    rockport?: { tempoMinutos: number; fcFinal: number };
};

export type AssessmentOutput = {
    densidadeCorporal: number;
    percentualGordura: number;
    massaGorda: number;
    massaMagra: number;
    classificacaoGordura: string;
    vo2Max?: number;
    classificacaoVO2?: string;
};

/**
 * Executa todos os cálculos de forma assíncrona, cedendo ao event loop
 * via `setImmediate` para não bloquear o servidor Next.js.
 *
 * @example
 * const resultado = await calcularAssessmentAsync({
 *   genero: 'M', idade: 28, pesoKg: 82,
 *   protocolo: 'JP3',
 *   dobrasJP3M: { peitoral: 12, abdominal: 18, coxa: 14 },
 *   cooperDistanciaM: 2800,
 * });
 */
export function calcularAssessmentAsync(
    input: AssessmentInputAsync
): Promise<AssessmentOutput> {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                const { genero, idade, pesoKg, protocolo } = input;

                // 1) Densidade e % gordura
                let densidadeCorporal: number;
                let percentualGordura: number;

                if (protocolo === 'JP7') {
                    if (!input.dobrasJP7) throw new Error('dobrasJP7 obrigatório para JP7');
                    densidadeCorporal = AssessmentEngine.calcularDensidadeJP7(input.dobrasJP7, genero, idade);
                    percentualGordura = parseFloat(((495 / densidadeCorporal) - 450).toFixed(2));
                } else {
                    // JP3
                    if (genero === 'M') {
                        if (!input.dobrasJP3M) throw new Error('dobrasJP3M obrigatório para JP3 masculino');
                        percentualGordura = AssessmentEngine.calcularPercentualGordura(
                            { triceps: input.dobrasJP3M.peitoral, abdomen: input.dobrasJP3M.abdominal, coxa: input.dobrasJP3M.coxa },
                            idade, genero
                        );
                    } else {
                        if (!input.dobrasJP3F) throw new Error('dobrasJP3F obrigatório para JP3 feminino');
                        percentualGordura = AssessmentEngine.calcularPercentualGordura(
                            { triceps: input.dobrasJP3F.triceps, suprailiaca: input.dobrasJP3F.suprailiaca, coxa: input.dobrasJP3F.coxa },
                            idade, genero
                        );
                    }
                    // Recalcular densidade para output
                    densidadeCorporal = 495 / (percentualGordura + 450);
                }

                // 2) Composição
                const massaGorda = parseFloat((pesoKg * percentualGordura / 100).toFixed(2));
                const massaMagra = parseFloat((pesoKg - massaGorda).toFixed(2));
                const classificacaoGordura = AssessmentEngine.classificarPercentualGordura(percentualGordura, genero);

                // 3) VO2 Max (opcional)
                let vo2Max: number | undefined;
                let classificacaoVO2: string | undefined;

                if (input.cooperDistanciaM != null) {
                    vo2Max = AssessmentEngine.calcularVO2MaxCooper(input.cooperDistanciaM);
                    classificacaoVO2 = AssessmentEngine.classificarCondicaoFisica(vo2Max, idade, genero);
                } else if (input.rockport) {
                    vo2Max = AssessmentEngine.calcularVO2MaxRockport(
                        input.rockport.tempoMinutos,
                        input.rockport.fcFinal,
                        pesoKg, genero, idade
                    );
                    classificacaoVO2 = AssessmentEngine.classificarCondicaoFisica(vo2Max, idade, genero);
                }

                resolve({
                    densidadeCorporal: parseFloat(densidadeCorporal.toFixed(5)),
                    percentualGordura,
                    massaGorda,
                    massaMagra,
                    classificacaoGordura,
                    vo2Max,
                    classificacaoVO2,
                });
            } catch (err) {
                reject(err);
            }
        });
    });
}
