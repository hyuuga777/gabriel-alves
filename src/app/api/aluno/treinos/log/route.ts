import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ALUNO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();
        const { treinoId, treinoNome, dataInicio, dataFim, exercicios } = body;

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { treinadorId: true } });
        if (!user || !user.treinadorId) {
            return NextResponse.json({ error: 'Treinador não encontrado para este aluno' }, { status: 400 });
        }

        // Criar o log do treino
        const treinoLog = await prisma.treinoLog.create({
            data: {
                alunoId: userId,
                treinadorId: user.treinadorId,
                treinoId,
                treinoNome,
                dataInicio: new Date(dataInicio),
                dataFim: new Date(dataFim),
                completo: true, // Ou lógica para parcial
                exercicios: {
                    create: exercicios.map((ex: any) => ({
                        exercicioTreinoId: ex.exercicioTreinoId,
                        exercicioNome: ex.nome,
                        carga: ex.carga ? parseFloat(ex.carga) : null,
                        repeticoes: ex.repeticoes ? parseInt(ex.repeticoes) : null,
                        concluido: ex.concluido
                    }))
                }
            }
        });

        return NextResponse.json(treinoLog);

    } catch (error) {
        console.error('Error logging workout:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
