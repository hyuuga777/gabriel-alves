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

        const assessments = await prisma.avaliacao.findMany({
            where: { alunoId: userId },
            orderBy: { data: 'asc' }, // Ascendente para facilitar gráficos
            select: {
                id: true,
                data: true,
                tipo: true,
                peso: true,
                // Adicionar outros campos conforme necessário para gráficos futuros (bf, etc)
            }
        });

        return NextResponse.json(assessments);

    } catch (error) {
        console.error('Error fetching student evolution:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
