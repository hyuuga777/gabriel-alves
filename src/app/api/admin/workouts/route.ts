import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { nome, descricao, tipo, exercises } = body;

        // Validations
        if (!nome) return new NextResponse("Nome é obrigatório", { status: 400 });
        if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return new NextResponse("Pelo menos um exercício é obrigatório", { status: 400 });
        }

        // Create transaction
        const workout = await prisma.treino.create({
            data: {
                nome,
                descricao,
                tipo: tipo || 'Geral', // Default type
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
                }
            },
            include: {
                exercicios: true
            }
        });

        return NextResponse.json(workout);

    } catch (error) {
        console.error("[ADMIN_WORKOUTS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
