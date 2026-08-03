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

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, nome, grupoMuscular, videoUrl } = body;

        if (!id || !nome) {
            return new NextResponse("ID and name are required", { status: 400 });
        }

        let updated;
        try {
            updated = await prisma.exercicio.update({
                where: { id },
                data: {
                    nome,
                    grupoMuscular: JSON.stringify(grupoMuscular || []),
                    videoUrl: videoUrl || null,
                }
            });
        } catch (dbError) {
            console.error("[ADMIN_EXERCISES_PUT] Mocking due to DB Error", dbError);
            const { getDb, saveDb } = await import("@/lib/localDb");
            const db = getDb();
            const index = db.exercises.findIndex((ex: any) => ex.id === id);
            if (index !== -1) {
                db.exercises[index] = {
                    ...db.exercises[index],
                    nome,
                    grupoMuscular: grupoMuscular || [],
                    videoUrl
                };
                saveDb(db);
                updated = db.exercises[index];
            } else {
                updated = { id, nome, grupoMuscular, videoUrl };
            }
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[ADMIN_EXERCISES_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse("ID parameter is required", { status: 400 });
        }

        try {
            await prisma.exercicio.delete({
                where: { id }
            });
        } catch (dbError) {
            console.error("[ADMIN_EXERCISES_DELETE] Mocking due to DB Error", dbError);
            const { getDb, saveDb } = await import("@/lib/localDb");
            const db = getDb();
            db.exercises = db.exercises.filter((ex: any) => ex.id !== id);
            saveDb(db);
        }

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("[ADMIN_EXERCISES_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

