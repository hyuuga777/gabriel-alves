import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

function excelDateToJSDate(serial: number): Date {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;                                        
    const date_info = new Date(utc_value * 1000);
    const fractional_day = serial - Math.floor(serial) + 0.0000001;
    let total_seconds = Math.floor(86400 * fractional_day);
    const seconds = total_seconds % 60;
    total_seconds -= seconds;
    
    // Test timezone America/Sao_Paulo (UTC-3)
    const tzOffset = 3 * 60 * 60 * 1000;
    return new Date(date_info.getTime() + tzOffset);
}

function parse() {
    const filePath = path.join(__dirname, '..', 'Ficha Gabriel Alves v6 - Copia.xlsx');
    const workbook = XLSX.readFile(filePath, { cellFormula: true });
    
    let md = `# Inventário Real do XLSX\n\n`;
    
    for (const sheetName of workbook.SheetNames) {
        md += `## Aba: ${sheetName}\n\n`;
        const sheet = workbook.Sheets[sheetName];
        
        md += `| Célula | Valor Bruto | Valor Normalizado | Fórmula | Nível de Confiança |\n`;
        md += `|---|---|---|---|---|\n`;
        
        // Vamos extrair as chaves e ordenar
        const keys = Object.keys(sheet).filter(k => k[0] !== '!');
        
        // Limitar a 50 celulas por aba para não estourar o markdown, exceto as principais
        let count = 0;
        for (const cell of keys) {
            if (count > 20) break;
            
            const cellObj = sheet[cell];
            if (!cellObj.v) continue;
            
            let raw = String(cellObj.v).replace(/\n/g, ' ');
            let normalized = raw;
            let formula = cellObj.f ? `\`${cellObj.f}\`` : '-';
            let conf = 'Alta';
            
            if (typeof cellObj.v === 'number' && cellObj.v > 30000 && cellObj.v < 50000) {
                // Provavel data
                normalized = excelDateToJSDate(cellObj.v).toISOString();
                conf = 'Alta (Data Detectada)';
            }
            
            md += `| ${cell} | ${raw.substring(0, 50)} | ${normalized.substring(0, 50)} | ${formula} | ${conf} |\n`;
            count++;
        }
        
        md += `\n`;
    }
    
    fs.writeFileSync(path.join(__dirname, '..', 'docs', 'importacao', 'inventario-xlsx-real.md'), md);
    console.log("Inventário gerado!");
}

parse();
