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

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ALUNO') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();

        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!admin) {
             return NextResponse.json({ error: 'No admin found to assign to this evaluation' }, { status: 500 });
        }

        const novaAvaliacao = await prisma.avaliacao.create({
            data: {
                alunoId: userId,
                treinadorId: admin.id,
                tipo: 'online', // or body.tipo
                peso: body.peso || null,
                percentualGordura: body.percentualGordura || null,
                perimetros: body.perimetros || {},
            }
        });

        return NextResponse.json({ success: true, avaliacao: novaAvaliacao });
    } catch (error) {
        console.error('Error creating student evolution:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
