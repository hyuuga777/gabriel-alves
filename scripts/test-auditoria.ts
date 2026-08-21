import * as fs from 'fs';
import * as path from 'path';
import { parseXlsxBuffer } from '../src/lib/importacao/xlsx-parser';

async function main() {
    console.log("=== Auditoria de Importação XLSX (Modo Local/Memória) ===");
    
    const filePath = path.join(__dirname, '..', 'Ficha Gabriel Alves v6 - Copia.xlsx');
    if (!fs.existsSync(filePath)) {
        console.error("Planilha não encontrada: " + filePath);
        process.exit(1);
    }
    
    const buffer = fs.readFileSync(filePath);
    const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

    console.log("-> Realizando Parse da Planilha Original sem Macros...");
    
    try {
        const alunos = parseXlsxBuffer(arrayBuffer as ArrayBuffer);
        
        console.log(`Foram identificadas ${alunos.length} fichas.`);
        
        const aluno = alunos[0];
        console.log(`\nFicha 1 (Hash de Origem: ${aluno.sourceHash})`);
        console.log(`- Nome: ${aluno.nome.value} [Confiança: ${aluno.nome.confidence}]`);
        console.log(`- Email Extraído: ${aluno.email ? aluno.email.value : 'Nenhum e-mail (Prevenindo fake email)'}`);
        console.log(`- Data de Nascimento: ${aluno.dataNascimento?.value?.toISOString()} [Origem Excel Serial convertido com offset pt-BR]`);
        console.log(`- Avaliações Físicas Mapeadas: ${aluno.avaliacoes.length}`);
        
        aluno.avaliacoes.forEach((av, i) => {
            console.log(`  -> Avaliação ${i+1} [Hash: ${av.sourceHash}] | Data: ${av.data?.value?.toISOString()} | BF: ${av.percentualGordura?.value || 'Nulo'}`);
        });

        console.log("\nSimulação de Identity / Idempotência (Sem DB Push):");
        console.log("Se importado 2 vezes, a API validará `externalSourceId` e `email`.");
        console.log("Resultado esperado na API: status = 'CONFLITO', exigindo que o Treinador escolha entre SOBRESCREVER, IGNORAR, ou CRIAR_NOVO.");
        
        console.log("\nAuditoria completada com sucesso. Nenhum DB modificado.");

    } catch (e) {
        console.error("Erro no parser:", e);
    }
}

main();
