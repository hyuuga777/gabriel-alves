import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseXlsxBuffer } from '@/lib/importacao/xlsx-parser';
import crypto from 'crypto';
import { z } from 'zod';

export async function POST(req: Request) {
    try {
        // Auth Bypass for local MVP / tests (Mocked as requested)
        // In real app, `session = await auth()`
        const session = { user: { id: 'dev-treinador-id', role: 'ADMIN' } };

        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const hash = crypto.createHash('sha256').update(buffer).digest('hex');

        // Parse memory
        const alunosPrevia = parseXlsxBuffer(arrayBuffer);

        const simulacaoComStatus = await Promise.all(alunosPrevia.map(async aluno => {
            let status = 'NOVO';
            let conflicts = [];

            // Identity Policy 1: Email Se Existir
            if (aluno.email && aluno.email.value) {
                const byEmail = await prisma.user.findFirst({
                    where: { treinadorId: session.user.id, email: aluno.email.value }
                });
                if (byEmail) {
                    status = 'CONFLITO';
                    conflicts.push('Email já cadastrado');
                }
            }

            // Identity Policy 2: External Source Hash
            const byHash = await prisma.user.findFirst({
                where: { treinadorId: session.user.id, externalSourceId: aluno.sourceHash }
            });
            if (byHash) {
                status = 'CONFLITO';
                conflicts.push('Ficha já importada anteriormente (Hash colidiu)');
            }

            // Identity Policy 3: Nome Exato (Warning, requires manual merge)
            const byName = await prisma.user.findFirst({
                where: { treinadorId: session.user.id, name: aluno.nome.value }
            });
            if (byName && !byHash && !(aluno.email && aluno.email.value)) {
                status = 'CONFLITO';
                conflicts.push('Nome idêntico já existe. Possível duplicata.');
            }

            return {
                ...aluno,
                status,
                conflicts
            };
        }));

        // Zod check over something if needed. Here we validate file size.
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "Arquivo excede limite de 10MB" }, { status: 400 });
        }

        const batch = await prisma.importBatch.create({
            data: {
                treinadorId: session.user.id,
                arquivoOriginal: file.name,
                tamanho: file.size,
                hash,
                status: 'SIMULATED',
                modo: 'XLSX_ALUNO_V6',
                userIdExecutor: session.user.id,
                startedAt: new Date(),
                // arquivoBase64 removido por regras de segurança e DB audit
            }
        });

        return NextResponse.json({
            batchId: batch.id,
            alunos: simulacaoComStatus,
            totalEncontrado: simulacaoComStatus.length,
            novos: simulacaoComStatus.filter(a => a.status === 'NOVO').length,
            conflitos: simulacaoComStatus.filter(a => a.status === 'CONFLITO').length,
        });

    } catch (error: any) {
        console.error("[IMPORT_SIMULATE_ERROR]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
