import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (admin?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Buscar todos os alunos que tem mensagens ou são alunos ativos
        // Para simplificar: buscar todos os alunos, e incluir a última mensagem
        const alunos = await prisma.user.findMany({
            where: { role: 'ALUNO' },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                mensagensRecebidas: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                },
                mensagensEnviadas: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        });

        const contacts = await Promise.all(alunos.map(async (aluno) => {
            // Contar não lidas enviadas pelo aluno para o admin
            const unreadCount = await prisma.mensagem.count({
                where: {
                    remetenteId: aluno.id,
                    destinatarioId: admin.id,
                    lida: false
                }
            });

            // Determinar a última mensagem (seja enviada ou recebida)
            const lastReceived = aluno.mensagensRecebidas[0];
            const lastSent = aluno.mensagensEnviadas[0];

            let lastMessage = null;
            if (lastReceived && lastSent) {
                lastMessage = lastReceived.createdAt > lastSent.createdAt ? lastReceived : lastSent;
            } else if (lastReceived) {
                lastMessage = lastReceived;
            } else if (lastSent) {
                lastMessage = lastSent;
            }

            return {
                id: aluno.id,
                name: aluno.name,
                email: aluno.email,
                avatar: aluno.avatar,
                unreadCount,
                lastMessage: lastMessage ? {
                    conteudo: lastMessage.conteudo,
                    createdAt: lastMessage.createdAt
                } : null
            };
        }));

        // Ordenar por data da última mensagem (recentes primeiro)
        contacts.sort((a, b) => {
            const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json(contacts);

    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
