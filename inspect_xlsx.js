const xlsx = require('xlsx');
const fs = require('fs');

const filename = 'Ficha Gabriel Alves v6 - Copia.xlsx';
try {
    const workbook = xlsx.readFile(filename, { cellFormula: true, cellStyles: true });
    let output = `# Planilha Inventário\n\n`;
    output += `**Arquivo Original:** ${filename}\n`;
    output += `**Abas (Sheets):** ${workbook.SheetNames.join(', ')}\n\n`;

    workbook.SheetNames.forEach(sheetName => {
        output += `## Aba: ${sheetName}\n`;
        const sheet = workbook.Sheets[sheetName];
        let formulas = [];
        let dataCount = 0;
        
        for (let cell in sheet) {
            if (cell[0] === '!') continue;
            dataCount++;
            if (sheet[cell].f) {
                formulas.push(`- Célula ${cell}: Fórmula = \`${sheet[cell].f}\`, Valor = \`${sheet[cell].v}\``);
            }
        }
        output += `- **Total de Células Preenchidas:** ${dataCount}\n`;
        if (formulas.length > 0) {
            output += `- **Fórmulas Encontradas (${formulas.length}):**\n`;
            formulas.slice(0, 20).forEach(f => output += f + '\n');
            if (formulas.length > 20) output += `  - ... (mais ${formulas.length - 20} fórmulas não exibidas)\n`;
        } else {
            output += `- **Nenhuma fórmula encontrada (ou não suportada pelo xlsx).**\n`;
        }
        output += `\n`;
    });
    
    fs.writeFileSync('docs/planilha-inventario.md', output);
    console.log('docs/planilha-inventario.md gerado com sucesso.');
} catch (e) {
    console.error('Erro ao ler a planilha:', e);
}
