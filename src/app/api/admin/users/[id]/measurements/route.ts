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
            try {
                const avaliacoes = await prisma.avaliacao.findMany({
                    where: { alunoId: id },
                    orderBy: { data: 'desc' },
                    select: {
                        id: true,
                        data: true,
                        peso: true,
                        percentualGordura: true,
                        perimetros: true,
                        bioimpedancia: true,
                    }
                });

                const measurements: any[] = [];
                avaliacoes.forEach(av => {
                    const baseEntry: any = {
                        id: av.id,
                        date: av.data.toISOString(),
                        peso: av.peso,
                        percentualGordura: av.percentualGordura,
                        bioimpedancia: av.bioimpedancia,
                        perimetros: av.perimetros,
                    };
                    measurements.push(baseEntry);
                });

                return NextResponse.json({ measurements });
            } catch (dbError) {
                console.error("[MEASUREMENTS_GET] DB error, falling back to localDb:", dbError);
            }
        }

        // LocalDb fallback
        const { getDb } = await import("@/lib/localDb");
        const db = getDb();
        const measurements = (db.measurements as any)?.[id] || [];
        return NextResponse.json({ measurements });

    } catch (error) {
        console.error("[MEASUREMENTS_GET] Error:", error);
        // Try localDb as last resort
        try {
            const { getDb } = await import("@/lib/localDb");
            const db = getDb();
            const measurements = (db.measurements as any)?.[id] || [];
            return NextResponse.json({ measurements });
        } catch {
            return NextResponse.json({ measurements: [] });
        }
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
        const { parteCorpo, valor, unit = 'cm', peso, percentualGordura, massaMagra } = body;

        // Real DB: save to Avaliacao
        if (!id.startsWith('mock-') && !id.startsWith('std-')) {
            try {
                // Build perimetros key from parteCorpo
                const perimetroKey = parteCorpo.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');

                // Find most recent avaliacao (today)
                const today = new Date();
                const startOfDay = new Date(today.setHours(0, 0, 0, 0));

                let avaliacao = await prisma.avaliacao.findFirst({
                    where: {
                        alunoId: id,
                        data: { gte: startOfDay }
                    },
                    orderBy: { data: 'desc' }
                });

                const currentPerimetros = (avaliacao?.perimetros as any) || {};
                const updatedPerimetros = parteCorpo
                    ? { ...currentPerimetros, [perimetroKey]: parseFloat(valor) }
                    : currentPerimetros;

                if (avaliacao) {
                    avaliacao = await prisma.avaliacao.update({
                        where: { id: avaliacao.id },
                        data: {
                            ...(parteCorpo && { perimetros: updatedPerimetros }),
                            ...(peso && { peso: parseFloat(peso) }),
                            ...(percentualGordura && { percentualGordura: parseFloat(percentualGordura) }),
                        }
                    });
                } else {
                    avaliacao = await prisma.avaliacao.create({
                        data: {
                            alunoId: id,
                            treinadorId: session.user.id,
                            tipo: 'mensal',
                            ...(parteCorpo && { perimetros: updatedPerimetros }),
                            ...(peso && { peso: parseFloat(peso) }),
                            ...(percentualGordura && { percentualGordura: parseFloat(percentualGordura) }),
                        }
                    });
                }

                return NextResponse.json({ success: true, avaliacao });
            } catch (dbError) {
                console.error("[MEASUREMENTS_POST] DB error, falling back to localDb:", dbError);
            }
        }

        // LocalDb fallback
        const { getDb, saveDb } = await import("@/lib/localDb");
        const db = getDb();
        if (!db.measurements) db.measurements = {};
        const userMeasurements = (db.measurements as any)[id] || [];

        const entry = {
            id: 'meas-' + Date.now(),
            date: new Date().toISOString(),
            parteCorpo: parteCorpo || null,
            valor: valor ? parseFloat(valor) : null,
            unit,
            peso: peso ? parseFloat(peso) : null,
            percentualGordura: percentualGordura ? parseFloat(percentualGordura) : null,
            massaMagra: massaMagra ? parseFloat(massaMagra) : null,
            perimetros: parteCorpo ? { [parteCorpo]: parseFloat(valor) } : {},
        };

        userMeasurements.push(entry);
        (db.measurements as any)[id] = userMeasurements;
        saveDb(db);

        return NextResponse.json({ success: true, entry });

    } catch (error) {
        console.error("[MEASUREMENTS_POST] Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await auth();
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const measurementId = searchParams.get('measurementId');

        if (!measurementId) {
            return new NextResponse("measurementId is required", { status: 400 });
        }

        // Real DB
        if (!id.startsWith('mock-') && !id.startsWith('std-')) {
            try {
                await prisma.avaliacao.delete({ where: { id: measurementId } });
                return NextResponse.json({ success: true });
            } catch (dbError) {
                console.error("[MEASUREMENTS_DELETE] DB error:", dbError);
            }
        }

        // LocalDb fallback
        const { getDb, saveDb } = await import("@/lib/localDb");
        const db = getDb();
        if (db.measurements?.[id]) {
            (db.measurements as any)[id] = (db.measurements as any)[id].filter((m: any) => m.id !== measurementId);
            saveDb(db);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
