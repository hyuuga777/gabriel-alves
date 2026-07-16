import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId: targetUserId } = await params;
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Buscar mensagens trocadas entre o usuário atual e o alvo
        const messages = await prisma.mensagem.findMany({
            where: {
                OR: [
                    { remetenteId: currentUser.id, destinatarioId: targetUserId },
                    { remetenteId: targetUserId, destinatarioId: currentUser.id }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return NextResponse.json(messages);

    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const { userId: targetUserId } = await params;
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Marcar todas as mensagens enviadas pelo alvo para mim como lidas
        await prisma.mensagem.updateMany({
            where: {
                remetenteId: targetUserId,
                destinatarioId: currentUser.id,
                lida: false
            },
            data: {
                lida: true
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating read status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
