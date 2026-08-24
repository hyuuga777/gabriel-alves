import * as XLSX from 'xlsx';
import crypto from 'crypto';

export interface MappedField<T> {
    value: T;
    raw: string;
    sheet: string;
    cell: string;
    confidence: 'Alta' | 'Média' | 'Baixa' | 'Fórmula Inferida';
}

export interface AlunoImport {
    sourceHash: string; // Hash para controle de duplicidade de ficha
    nome: MappedField<string>;
    email: MappedField<string> | null;
    genero: MappedField<string>;
    dataNascimento: MappedField<Date> | null;
    planoAdquirido: MappedField<string> | null;
    dataInicioPlano: MappedField<Date> | null;
    dataFimPlano: MappedField<Date> | null;
    valorPlano: MappedField<number> | null;
    doresIntensidade: MappedField<string> | null;
    objetivos: MappedField<string> | null;
    limitacoes: MappedField<string> | null;
    referenciaObjetivo: MappedField<string> | null;
    pontosFracos: MappedField<string> | null;
    pontosFortes: MappedField<string> | null;
    exerciciosProibidos: MappedField<string> | null;
    avaliacoes: AvaliacaoImport[];
}

export interface AvaliacaoImport {
    sourceHash: string; // Hash da linha/coluna
    data: MappedField<Date> | null;
    peso: MappedField<number> | null;
    percentualGordura: MappedField<number> | null;
}

// Helper para converter data do Excel (Tratamento Bug 1900)
export function excelDateToJSDate(serial: number): Date {
    // Excel bug: considers 1900 a leap year. Day 60 is Feb 29, 1900.
    if (serial === 60) {
        // Technically doesn't exist, we fallback to Mar 1, 1900 UTC
        return new Date(Date.UTC(1900, 2, 1));
    }
    
    // If serial is before 60, we don't subtract the leap year bug day
    let adjustedSerial = serial;
    if (serial > 60) {
        adjustedSerial = serial - 1; // Correct the bug
    }
    
    // Offset from 1899-12-31 to 1970-01-01 is 25568 days
    const daysSince1970 = Math.floor(adjustedSerial - 25568);
    const fractional_day = serial - Math.floor(serial);
    
    // Extract time components if present
    const total_seconds = Math.round(86400 * fractional_day);
    const hours = Math.floor(total_seconds / 3600);
    const minutes = Math.floor((total_seconds % 3600) / 60);
    const seconds = total_seconds % 60;

    // Se a data tem hora, trataremos via offset. Caso contrário, UTC puro (LocalDate sem deslocamento).
    if (fractional_day > 0) {
        const utcDate = new Date(Date.UTC(1970, 0, daysSince1970, hours, minutes, seconds));
        // Se houver hora exata, aplica o offset do fuso do Brasil, ou deixa em UTC.
        // A regra diz: Trate data sem horário como LocalDate, sem deslocamento por timezone.
        // Use America/Sao_Paulo apenas quando houver horário real.
        // Simulando America/Sao_Paulo (UTC-3)
        const tzOffset = 3 * 60 * 60 * 1000;
        return new Date(utcDate.getTime() + tzOffset);
    } else {
        return new Date(Date.UTC(1970, 0, daysSince1970));
    }
}

export function parseXlsxBuffer(buffer: ArrayBuffer): AlunoImport[] {
    const workbook = XLSX.read(buffer, { type: 'array', cellFormula: true });
    
    // Suporte a múltiplas fichas futuramente, por enquanto procura aba Menu principal
    const menuSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('menu'));
    if (!menuSheetName) throw new Error("Aba 'Menu' não encontrada no arquivo Excel.");
    
    const menuSheet = workbook.Sheets[menuSheetName];
    
    const extract = <T>(sheetName: string, sheet: XLSX.WorkSheet, cell: string, type: 'string' | 'number' | 'date'): MappedField<T> | null => {
        const cellObj = sheet[cell];
        if (!cellObj || cellObj.v === undefined || cellObj.v === null || cellObj.v === '' || cellObj.v === '#REF!') return null;
        
        const raw = String(cellObj.v);
        let value: any = raw;
        let confidence: MappedField<T>['confidence'] = cellObj.f ? 'Fórmula Inferida' : 'Alta';

        if (type === 'date') {
            if (typeof cellObj.v === 'number') {
                value = excelDateToJSDate(cellObj.v);
            } else {
                value = null; // Falback or parse
                confidence = 'Baixa';
            }
        } else if (type === 'number') {
            if (raw.includes('#REF!')) {
                value = 'NOT_CALCULATED';
                confidence = 'Baixa';
            } else {
                value = typeof cellObj.v === 'number' ? cellObj.v : parseFloat(raw.replace(',', '.'));
                if (isNaN(value)) {
                    value = null;
                    confidence = 'Baixa';
                }
            }
        } else if (type === 'string') {
            value = raw.trim();
        }

        if (value === null) return null;

        return {
            value,
            raw,
            sheet: sheetName,
            cell,
            confidence
        };
    };

    const nome = extract<string>(menuSheetName, menuSheet, 'E15', 'string');
    if (!nome) throw new Error("Ficha inválida: Nome do Aluno não encontrado.");

    // Identity hash
    const hash = crypto.createHash('sha256').update(nome.value + (extract<Date>(menuSheetName, menuSheet, 'E20', 'date')?.value?.toISOString() || '')).digest('hex');

    const aluno: AlunoImport = {
        sourceHash: hash,
        nome: nome,
        email: null, // O email real não existe na planilha, manter null para não usar email falso
        genero: extract<string>(menuSheetName, menuSheet, 'E16', 'string') || { value: 'Não informado', raw: '', sheet: menuSheetName, cell: 'E16', confidence: 'Baixa' },
        dataNascimento: extract<Date>(menuSheetName, menuSheet, 'E20', 'date'),
        planoAdquirido: extract<string>(menuSheetName, menuSheet, 'E28', 'string'),
        dataInicioPlano: extract<Date>(menuSheetName, menuSheet, 'E29', 'date'),
        dataFimPlano: extract<Date>(menuSheetName, menuSheet, 'E30', 'date'),
        valorPlano: extract<number>(menuSheetName, menuSheet, 'E31', 'number'),
        doresIntensidade: extract<string>(menuSheetName, menuSheet, 'E34', 'string'),
        objetivos: extract<string>(menuSheetName, menuSheet, 'E35', 'string'),
        limitacoes: extract<string>(menuSheetName, menuSheet, 'E36', 'string'),
        referenciaObjetivo: extract<string>(menuSheetName, menuSheet, 'E37', 'string'),
        pontosFracos: extract<string>(menuSheetName, menuSheet, 'E38', 'string'),
        pontosFortes: extract<string>(menuSheetName, menuSheet, 'E39', 'string'),
        exerciciosProibidos: extract<string>(menuSheetName, menuSheet, 'E40', 'string'),
        avaliacoes: []
    };

    // Extrair avaliações
    const avSheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('avaliação presencial') || s.toLowerCase().includes('avaliacao presencial'));
    if (avSheetName) {
        const avSheet = workbook.Sheets[avSheetName];
        const colunas = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
        
        for (const col of colunas) {
            const dataField = extract<Date>(avSheetName, avSheet, `${col}11`, 'date');
            if (dataField && dataField.value) {
                let pesoField = extract<number | string>(avSheetName, avSheet, `${col}16`, 'number');
                let bfField = extract<number | string>(avSheetName, avSheet, `${col}28`, 'number');
                let imcField = extract<number | string>(avSheetName, avSheet, `${col}19`, 'number');
                
                // Mapeia #REF! para explícito nulo mas mantendo a raw
                if (bfField && bfField.value === 'NOT_CALCULATED') {
                    bfField.value = null as any;
                }

                if (imcField && imcField.value === 'NOT_CALCULATED') {
                    // Try to calculate manually if we have height/weight
                    const height = extract<number>(menuSheetName, menuSheet, 'C11', 'number');
                    if (height && height.value && pesoField && pesoField.value) {
                        const calculated = (pesoField.value as number) / Math.pow(height.value as number, 2);
                        imcField = {
                            value: parseFloat(calculated.toFixed(2)),
                            raw: String(calculated),
                            sheet: avSheetName,
                            cell: `${col}19`,
                            confidence: 'Fórmula Inferida'
                        };
                    } else {
                        imcField.value = null as any;
                    }
                }
                
                const avHash = crypto.createHash('sha256')
                    .update(dataField.value.toISOString() + (pesoField?.value || 0))
                    .digest('hex');

                aluno.avaliacoes.push({
                    sourceHash: avHash,
                    data: dataField,
                    peso: pesoField as unknown as MappedField<number>,
                    percentualGordura: bfField as unknown as MappedField<number>
                });
            }
        }
    }

    return [aluno];
}
