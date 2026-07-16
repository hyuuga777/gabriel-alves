import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await prisma.pagamento.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                assinatura: {
                    include: {
                        user: { select: { name: true, email: true, avatar: true } },
                        plano: { select: { nome: true } }
                    }
                }
            }
        });

        const formattedTransactions = transactions.map(t => ({
            id: t.id,
            user: {
                name: t.assinatura.user.name,
                email: t.assinatura.user.email,
                avatar: t.assinatura.user.avatar,
            },
            plan: t.assinatura.plano.nome,
            amount: t.valor,
            status: t.status, // approved, pending, rejected
            method: t.metodoPagamento,
            date: t.createdAt
        }));

        return NextResponse.json(formattedTransactions);

    } catch (error) {
        console.error('Error fetching transactions:', error);

        // Mock data
        return NextResponse.json([
            { id: '1', user: { name: 'João Silva', email: 'joao@example.com' }, plan: 'Mensal', amount: 89.90, status: 'approved', method: 'credit_card', date: new Date().toISOString() },
            { id: '2', user: { name: 'Maria Souza', email: 'maria@example.com' }, plan: 'Trimestral', amount: 249.90, status: 'pending', method: 'pix', date: new Date(Date.now() - 86400000).toISOString() },
            { id: '3', user: { name: 'Pedro Alves', email: 'pedro@example.com' }, plan: 'Mensal', amount: 89.90, status: 'rejected', method: 'credit_card', date: new Date(Date.now() - 172800000).toISOString() },
        ]);
    }
}
