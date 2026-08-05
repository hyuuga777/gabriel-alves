import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Real DB: fetch from Avaliacao model
        if (!id.startsWith('mock-') && !id.startsWith('std-')) {
            const avaliacoes = await prisma.avaliacao.findMany({
                where: { alunoId: id },
                orderBy: { data: 'desc' },
            });
            return NextResponse.json({ avaliacoes });
        }

        return NextResponse.json({ avaliacoes: [] });
    } catch (error) {
        console.error("[AVALIACOES_GET] Error:", error);
        return NextResponse.json({ avaliacoes: [] }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        
        if (!id.startsWith('mock-') && !id.startsWith('std-')) {
            const avaliacao = await prisma.avaliacao.create({
                data: {
                    alunoId: id,
                    treinadorId: session.user.id,
                    tipo: body.tipo || 'mensal',
                    ...body,
                }
            });
            return NextResponse.json({ success: true, avaliacao });
        }

        return NextResponse.json({ success: true, avaliacao: body });
    } catch (error) {
        console.error("[AVALIACOES_POST] Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
