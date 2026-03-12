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

        // 1. Frequência Semanal (Últimos 7 dias)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentLogs = await prisma.treinoLog.findMany({
            where: {
                alunoId: userId,
                createdAt: { gte: sevenDaysAgo }
            }
        });

        // Agrupar por dia para contar dias únicos de treino
        const treinoDays = new Set(recentLogs.map(log => log.createdAt.toISOString().split('T')[0]));
        const weeklyFrequency = treinoDays.size;

        // 2. Peso Atual (Última avaliação)
        const lastAssessment = await prisma.avaliacao.findFirst({
            where: { alunoId: userId, peso: { not: null } },
            orderBy: { data: 'desc' }
        });

        // 3. Evolução (Comparar com penúltima avaliação ou mensagem "Inicial")
        let weightDiff = 0;
        if (lastAssessment?.peso) {
            const previousAssessment = await prisma.avaliacao.findFirst({
                where: {
                    alunoId: userId,
                    peso: { not: null },
                    id: { not: lastAssessment.id }, // Ignorar a última
                    data: { lt: lastAssessment.data } // Mais antiga
                },
                orderBy: { data: 'desc' }
            });

            if (previousAssessment?.peso) {
                weightDiff = lastAssessment.peso - previousAssessment.peso;
            }
        }

        // 4. Próxima Avaliação (Mockada ou baseada em regra de negócio, ex: +30 dias da ultima)
        let nextAssessmentDate = null;
        if (lastAssessment) {
            const nextDate = new Date(lastAssessment.data);
            nextDate.setDate(nextDate.getDate() + 30); // Regra mensal
            nextAssessmentDate = nextDate;
        }

        // 5. Treino Sugerido (Poderia ser o próximo da sequência ou um aleatório dos atribuídos)
        // Por simplificação, vamos pegar o primeiro treino atribuído que não foi feito hoje?
        // Ou simplesmente retornar um resumo dos treinos.
        const activeTrainings = await prisma.atribuicaoTreino.findMany({
            where: { alunoId: userId, ativo: true },
            include: { treino: { include: { exercicios: true } } }
        });

        return NextResponse.json({
            frequency: weeklyFrequency,
            currentWeight: lastAssessment?.peso || 0,
            weightDiff: Number(weightDiff.toFixed(1)),
            nextAssessment: nextAssessmentDate,
            activeTrainingsCount: activeTrainings.length,
            // Mocking chart data if no real data exists to avoid breaking UI on empty state
            weightHistory: [] // To be implemented or fetched from separate endpoint
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
