import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sender = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!sender) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { destinatarioId, conteudo, anexoUrl } = body;

        if (!destinatarioId || !conteudo) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const message = await prisma.mensagem.create({
            data: {
                remetenteId: sender.id,
                destinatarioId,
                conteudo,
                anexoUrl,
                lida: false
            }
        });

        return NextResponse.json(message);

    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
