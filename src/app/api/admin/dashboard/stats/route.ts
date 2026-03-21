import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. KPIs
        // Alunos Ativos (com assinatura ativa)
        const activeStudents = await prisma.user.count({
            where: {
                role: 'ALUNO',
                assinatura: {
                    status: 'ATIVA'
                }
            }
        });

        // Receita Total (Soma de todos os pagamentos aprovados)
        const totalRevenueAgg = await prisma.pagamento.aggregate({
            _sum: { valor: true },
            where: { status: 'approved' }
        });
        const totalRevenue = totalRevenueAgg._sum.valor || 0;

        // Avaliações Pendentes (Exemplo: Alunos sem avaliação nos últimos 30 dias)
        // Como não há um campo "pendente", vamos contar quantos alunos não tiveram avaliação nos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const studentsWithRecentEval = await prisma.avaliacao.findMany({
            where: { createdAt: { gte: thirtyDaysAgo } },
            select: { alunoId: true },
            distinct: ['alunoId']
        });
        const studentIdsWithRecentEval = studentsWithRecentEval.map(e => e.alunoId);

        const pendingAssessments = await prisma.user.count({
            where: {
                role: 'ALUNO',
                id: { notIn: studentIdsWithRecentEval },
                assinatura: { status: 'ATIVA' }
            }
        });

        // Mensalidades em Atraso (Simplificado: Assinaturas expiradas ou suspensas)
        const latePayments = await prisma.assinatura.count({
            where: {
                status: { in: ['EXPIRADA', 'SUSPENSA'] }
            }
        });

        // 2. Gráfico de Faturamento (6 meses)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const payments = await prisma.pagamento.findMany({
            where: {
                status: 'approved',
                createdAt: { gte: sixMonthsAgo }
            },
            orderBy: { createdAt: 'asc' }
        });

        const revenueChart = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('pt-BR', { month: 'short' });
            const name = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);
            const targetMonth = d.getMonth();
            const targetYear = d.getFullYear();

            const total = payments
                .filter(p => p.createdAt.getMonth() === targetMonth && p.createdAt.getFullYear() === targetYear)
                .reduce((acc, curr) => acc + curr.valor, 0);

            revenueChart.push({ name, value: total });
        }

        // 3. Atividades Recentes (Mix de Treinos, Pagamentos e Avaliações)
        const [recentWorkouts, recentPayments, recentEvaluations] = await Promise.all([
            prisma.treinoLog.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { aluno: { select: { name: true, avatar: true } } }
            }),
            prisma.pagamento.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { assinatura: { include: { user: { select: { name: true, avatar: true } } } } }
            }),
            prisma.avaliacao.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { aluno: { select: { name: true, avatar: true } } }
            })
        ]);

        const activities = [
            ...recentWorkouts.map(w => ({
                id: `workout-${w.id}`,
                type: 'workout',
                user: w.aluno.name,
                avatar: w.aluno.avatar,
                description: `Concluiu o treino: ${w.treinoNome}`,
                time: w.createdAt,
                status: 'success'
            })),
            ...recentPayments.filter(p => p.status === 'approved').map(p => ({
                id: `payment-${p.id}`,
                type: 'payment',
                user: p.assinatura.user.name,
                avatar: p.assinatura.user.avatar,
                description: `Pagamento de R$ ${p.valor.toFixed(2)} aprovado`,
                time: p.createdAt,
                status: 'success'
            })),
            ...recentEvaluations.map(e => ({
                id: `eval-${e.id}`,
                type: 'evaluation',
                user: e.aluno.name,
                avatar: e.aluno.avatar,
                description: `Nova avaliação física (${e.tipo})`,
                time: e.createdAt,
                status: 'info'
            }))
        ]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 8);

        return NextResponse.json({
            kpis: {
                activeStudents,
                totalRevenue,
                pendingAssessments,
                latePayments
            },
            revenueChart,
            activities
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
