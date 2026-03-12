import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const exercises = await prisma.exercicio.findMany({
            orderBy: { nome: 'asc' }
        });

        return NextResponse.json(exercises);
    } catch (error) {
        console.error("[ADMIN_EXERCISES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { nome, grupoMuscular, videoUrl } = body;

        if (!nome) {
            return new NextResponse("Name is required", { status: 400 });
        }

        const exercise = await prisma.exercicio.create({
            data: {
                nome,
                grupoMuscular: grupoMuscular || [],
                videoUrl: videoUrl || null,
            }
        });

        return NextResponse.json(exercise);
    } catch (error) {
        console.error("[ADMIN_EXERCISES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
