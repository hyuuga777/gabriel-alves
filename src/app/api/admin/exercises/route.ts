import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        let exercises = [];
        try {
            exercises = await prisma.exercicio.findMany({
                orderBy: { nome: 'asc' }
            });
        } catch (dbError: any) {
            console.error("[ADMIN_EXERCISES_GET] DB Error, using mocks:", dbError.message);
            const { getDb } = await import("@/lib/localDb");
            exercises = getDb().exercises;
        }

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

        let exercise;
        try {
            exercise = await prisma.exercicio.create({
                data: {
                    nome,
                    grupoMuscular: JSON.stringify(grupoMuscular || []),
                    videoUrl: videoUrl || null,
                    equipamento: JSON.stringify([]),
                }
            });
        } catch (dbError) {
            console.error("[ADMIN_EXERCISES_POST] Mocking due to DB Error", dbError);
            const { getDb, saveDb } = await import("@/lib/localDb");
            const db = getDb();
            exercise = {
                id: 'mock-ex-' + Date.now(),
                nome,
                grupoMuscular: grupoMuscular || [],
                videoUrl: videoUrl,
                equipamento: []
            };
            db.exercises.unshift(exercise);
            saveDb(db);
        }

        return NextResponse.json(exercise);
    } catch (error) {
        console.error("[ADMIN_EXERCISES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
