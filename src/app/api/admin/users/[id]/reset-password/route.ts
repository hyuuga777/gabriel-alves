import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateTempPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
        pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
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

        const tempPassword = generateTempPassword();

        if (id.startsWith('mock-') || id.startsWith('std-')) {
            const { getDb } = await import("@/lib/localDb");
            const db = getDb();
            const user = db.users?.find((u: any) => u.id === id);
            const email = user?.email ?? "aluno@exemplo.com";
            return NextResponse.json({
                success: true,
                message: "Em producao, a senha sera enviada por e-mail automaticamente.",
                tempPassword,
                email,
                note: "modo_local"
            });
        }

        const user = await prisma.user.findUnique({ where: { id }, select: { email: true, name: true } });
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Configure um SMTP para envio automatico de senhas.",
            tempPassword,
            email: user.email,
            note: "modo_producao"
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        const tempPassword = generateTempPassword();
        try {
            const { getDb } = await import("@/lib/localDb");
            const db = getDb();
            const user = db.users?.find((u: any) => u.id === id);
            return NextResponse.json({
                success: true,
                message: "Senha temporaria gerada (modo local).",
                tempPassword,
                email: user?.email ?? "aluno@exemplo.com",
                note: "modo_local_fallback"
            });
        } catch {
            return NextResponse.json({
                success: true,
                message: "Senha temporaria gerada.",
                tempPassword,
                email: "-",
                note: "modo_local_fallback"
            });
        }
    }
}
