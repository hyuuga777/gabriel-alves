// @ts-nocheck
import { auth } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const plans = await prisma.plano.findMany({
            orderBy: {
                preco: 'asc'
            }
        });

        const mappedPlans = plans.map(plan => ({
            ...plan,
            id: plan.id,
            name: plan.nome,
            descricao: plan.descricao,
            price: plan.preco.toString(),
            period: plan.intervalo,
            features: plan.recursos,
            active: plan.ativo,
            highlight: plan.destaque,
            highlightText: plan.textoDestaque,
            discount: plan.desconto,
            gradient: plan.gradiente,
        }));

        return NextResponse.json(mappedPlans);
    } catch (error) {
        console.error("[ADMIN_PLANS_GET]", error);
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

        if (!name || price === undefined || !period) {
            return new NextResponse("Missing required fields (name, price, period)", { status: 400 });
        }

        const plan = await prisma.plano.create({
            // @ts-ignore
            data: {
                nome: name,
                descricao,
                preco: typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price,
                intervalo: period,
                recursos: features,
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
        console.error("[ADMIN_PLANS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
