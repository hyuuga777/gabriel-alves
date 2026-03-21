import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id } = params;

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
            data: {
                name,
                descricao,
                price: price !== undefined ? (typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price) : undefined,
                period,
                features,
                active,
                highlight,
                highlightText,
                desconto: discount,
                gradient,
            }
        });

        return NextResponse.json(plan);
    } catch (error) {
        console.error("[ADMIN_PLAN_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = params;

        // Check if there are subscriptions for this plan
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
