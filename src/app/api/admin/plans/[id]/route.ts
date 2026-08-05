// @ts-nocheck
import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id } = await params;

        const {
            name,
            descricao,
            price,
            period,
            features,
            active,
            highlight,
            highlightText,
            discount,
            gradient
        } = body;

        const plan = await prisma.plano.update({
            where: { id },
            // @ts-ignore
            data: {
                nome: name,
                descricao,
                preco: price !== undefined ? (typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price) : undefined,
                intervalo: period,
                recursos: Array.isArray(features) ? JSON.stringify(features) : features,
                ativo: active,
                destaque: highlight,
                textoDestaque: highlightText,
                desconto: discount,
                gradiente: gradient,
            }
        });

        return NextResponse.json({
            ...plan,
            name: plan.nome,
            price: plan.preco.toString(),
            period: plan.intervalo,
            features: plan.recursos,
            active: plan.ativo,
            highlight: plan.destaque,
            highlightText: plan.textoDestaque,
            discount: plan.desconto,
            gradient: plan.gradiente,
        });
    } catch (error) {
        console.error("[ADMIN_PLAN_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        // Verificar se existem assinaturas vinculadas a este plano
        const subscriptionsCount = await prisma.assinatura.count({
            where: { planoId: id }
        });

        if (subscriptionsCount > 0) {
            return new NextResponse("Cannot delete plan with active subscriptions", { status: 400 });
        }

        await prisma.plano.delete({
            where: { id }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[ADMIN_PLAN_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
