import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const alunoId = searchParams.get('alunoId');

        const assessments = await prisma.avaliacao.findMany({
            where: alunoId ? { alunoId } : undefined,
            include: {
                aluno: {
                    select: { id: true, name: true, email: true }
                }
            },
            orderBy: { data: 'desc' }
        });

        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { alunoId, tipo, data, peso, bioimpedancia, dobrasCutaneas, perimetros } = body;

        const assessment = await prisma.avaliacao.create({
            data: {
                alunoId,
                treinadorId: session.user.id,
                tipo,
                data: new Date(data),
                peso: peso ? parseFloat(peso) : null,
                bioimpedancia: bioimpedancia ? bioimpedancia : undefined,
                dobrasCutaneas: dobrasCutaneas ? dobrasCutaneas : undefined,
                perimetros: perimetros ? perimetros : undefined
            }
        });

        return NextResponse.json(assessment);
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
