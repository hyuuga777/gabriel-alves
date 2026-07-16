import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/localDb";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TREINADOR')) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // Fallback for mock IDs
        if (id.startsWith('mock-')) {
            const db = getDb();
            const localWorkout = db.workouts?.find((w: any) => w.id === id);
            if (localWorkout) return NextResponse.json(localWorkout);
            return new NextResponse("Mock workout not found", { status: 404 });
        }

        const workout = await prisma.treino.findUnique({
            where: { id },
            include: {
                exercicios: {
                    include: {
                        exercicio: true
                    },
                    orderBy: {
                        ordem: 'asc'
                    }
                },
                atribuicoes: {
                    include: {
                        aluno: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!workout) {
            return new NextResponse("Workout not found", { status: 404 });
        }

        // Format for the UI
        const formatted = {
            id: workout.id,
            titulo: workout.nome,
            descricao: workout.descricao,
            tipo: workout.tipo,
            aluno: workout.atribuicoes.length > 0 ? {
                id: workout.atribuicoes[0].aluno.id,
                nome: workout.atribuicoes[0].aluno.name,
                avatar: workout.atribuicoes[0].aluno.name.substring(0, 2).toUpperCase()
            } : { id: 'default', nome: 'Padrão / Geral', avatar: 'PG' },
            criadoEm: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(workout.createdAt),
            atualizadoEm: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(workout.updatedAt),
            observacoes: workout.descricao, // Fallback to description as observacoes
            exercicios: workout.exercicios.map((ex) => ({
                id: ex.id,
                nome: ex.exercicio.nome,
                grupoMuscular: ex.exercicio.grupoMuscular || 'Geral',
                series: ex.series,
                repeticoes: ex.repeticoes,
                cargaSugerida: ex.observacoes || '', // Carga is stored in observacoes in WorkoutBuilder
                intervalo: ex.descanso
            }))
        };

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("[ADMIN_WORKOUT_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TREINADOR')) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        if (id.startsWith('mock-')) {
            const db = getDb();
            db.workouts = db.workouts.filter((w: any) => w.id !== id);
            const { saveDb } = await import("@/lib/localDb");
            saveDb(db);
            return NextResponse.json({ message: "Mock deleted" });
        }

        await prisma.treino.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Workout deleted successfully" });
    } catch (error) {
        console.error("[ADMIN_WORKOUT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
