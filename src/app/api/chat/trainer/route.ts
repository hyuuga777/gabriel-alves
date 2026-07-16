import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Simplificação: Retorna o primeiro ADMIN encontrado no sistema.
        // Em um sistema real, seria o personal trainer vinculado ao aluno.
        const admin = await prisma.user.findFirst({
            where: { role: 'ADMIN' },
            select: { id: true, name: true, avatar: true }
        });

        if (!admin) {
            return NextResponse.json({ error: 'No trainer found' }, { status: 404 });
        }

        return NextResponse.json(admin);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
