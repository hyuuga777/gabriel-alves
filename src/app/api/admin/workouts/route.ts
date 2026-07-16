import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TREINADOR')) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { nome, descricao, tipo, exercises, alunoId } = body;

        // Validations
        if (!nome) return new NextResponse("Nome é obrigatório", { status: 400 });
        if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return new NextResponse("Pelo menos um exercício é obrigatório", { status: 400 });
        }

        let workout;
        try {
            // Create transaction: Treino + Exercicios + optionally Atribuicao
            workout = await prisma.treino.create({
                data: {
                    nome,
                    descricao,
                    tipo: tipo || 'Geral',
                    treinadorId: session.user.id,
                    exercicios: {
                        create: exercises.map((ex: { exercicioId: string; series: string; repeticoes: string; descanso: string; observacoes?: string }, index: number) => ({
                            exercicioId: ex.exercicioId,
                            series: parseInt(ex.series || '3'),
                            repeticoes: ex.repeticoes || '10',
                            descanso: parseInt(ex.descanso || '60'),
                            ordem: index,
                            observacoes: ex.observacoes
                        }))
                    },
                    ...(alunoId && alunoId !== 'default' ? {
                        atribuicoes: {
                            create: {
                                alunoId: alunoId,
                                diasSemana: JSON.stringify([1, 2, 3, 4, 5]), // Default to all weekdays if not specified
                                ativo: true
                            }
                        }
                    } : {})
                },
                include: {
                    exercicios: true,
                    atribuicoes: true
                }
            });
        } catch (dbError) {
            console.error("[ADMIN_WORKOUTS_POST] Mocking due to DB Error", dbError);
            const { getDb, saveDb } = await import("@/lib/localDb");
            const db = getDb();
            workout = {
                id: 'mock-workout-' + Date.now(),
                titulo: nome,
                nome,
                descricao,
                tipo: tipo || 'Geral',
                aluno: alunoId && alunoId !== 'default' ? 'Aluno Específico' : 'Vários / Geral',
                exercicios: exercises.length,
                criadoEm: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())
            };
            db.workouts.unshift(workout);
            saveDb(db);
        }

        return NextResponse.json(workout);

    } catch (error) {
        console.error("[ADMIN_WORKOUTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TREINADOR')) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const workouts = await prisma.treino.findMany({
            where: {
                treinadorId: session.user.id
            },
            include: {
                exercicios: true,
                atribuicoes: {
                    include: {
                        aluno: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Format for the UI
        const formattedWorkouts = workouts.map(w => ({
            id: w.id,
            titulo: w.nome,
            tipo: w.tipo,
            aluno: w.atribuicoes.length > 0 ? w.atribuicoes[0].aluno.name : 'Vários / Geral',
            exercicios: w.exercicios.length,
            criadoEm: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(w.createdAt)
        }));

        return NextResponse.json(formattedWorkouts);

    } catch (error) {
        console.error("[ADMIN_WORKOUTS_GET]", error);
        const { getDb } = await import("@/lib/localDb");
        return NextResponse.json(getDb().workouts);
    }
}
