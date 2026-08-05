import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string; avaliacaoId: string }> }
) {
    const { id, avaliacaoId } = await params;

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        if (!id.startsWith('mock-') && !id.startsWith('std-')) {
            const avaliacao = await prisma.avaliacao.update({
                where: { id: avaliacaoId },
                data: body,
            });
            return NextResponse.json({ success: true, avaliacao });
        }

        return NextResponse.json({ success: true, avaliacao: body });
    } catch (error) {
        console.error("[AVALIACOES_PUT] Error:", error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
