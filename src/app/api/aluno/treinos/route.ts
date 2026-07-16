import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ALUNO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Buscar treinos atribuídos
        const assignedWorkouts = await prisma.atribuicaoTreino.findMany({
            where: {
                alunoId: userId,
                ativo: true
            },
            include: {
                treino: {
                    include: {
                        _count: { select: { exercicios: true } }
                    }
                }
            }
        });

        // Formatar para retorno
        const workouts = assignedWorkouts.map(assignment => ({
            id: assignment.treino.id,
            name: assignment.treino.nome,
            description: assignment.treino.descricao,
            tipo: assignment.treino.tipo, // A, B, C
            exercisesCount: assignment.treino._count.exercicios,
            updatedAt: assignment.updatedAt
        }));

        return NextResponse.json(workouts);

    } catch (error) {
        console.error('Error fetching student workouts:', error);
        // Fallback to empty array instead of error to not break UI
        return NextResponse.json([]);
    }
}
