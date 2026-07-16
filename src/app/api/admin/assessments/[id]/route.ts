import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { tipo, data, peso, bioimpedancia, dobrasCutaneas, perimetros } = body;

        const assessment = await prisma.avaliacao.update({
            where: { id },
            data: {
                tipo,
                data: new Date(data),
                peso: peso ? parseFloat(peso) : null,
                bioimpedancia: bioimpedancia || {},
                dobrasCutaneas: dobrasCutaneas || {},
                perimetros: perimetros || {}
            }
        });

        return NextResponse.json(assessment);
    } catch (error) {
        console.error('Error updating assessment:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.avaliacao.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting assessment:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
