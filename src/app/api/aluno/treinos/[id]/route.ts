import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ALUNO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const userId = session.user.id;

        // Verificar se esse treino está atribuído ao aluno
        const assignment = await prisma.atribuicaoTreino.findUnique({
            where: {
                treinoId_alunoId: {
                    treinoId: id,
                    alunoId: userId
                }
            }
        });

        if (!assignment || !assignment.ativo) {
            return NextResponse.json({ error: 'Treino não disponível' }, { status: 403 });
        }

        // Buscar detalhes do treino e exercícios
        const workout = await prisma.treino.findUnique({
            where: { id },
            include: {
                exercicios: {
                    orderBy: { ordem: 'asc' },
                    include: {
                        exercicio: {
                            select: {
                                nome: true,
                                videoUrl: true,
                                instrucoes: true
                            }
                        }
                    }
                }
            }
        });

        if (!workout) {
            return NextResponse.json({ error: 'Treino não encontrado' }, { status: 404 });
        }

        return NextResponse.json(workout);

    } catch (error) {
        console.error('Error fetching workout details:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
