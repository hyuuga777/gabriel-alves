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
                price: 'asc'
            }
        });

        // Map database field 'desconto' to frontend field 'discount'
        const mappedPlans = plans.map(plan => ({
            ...plan,
            discount: plan.desconto,
            price: plan.price.toString()
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
            data: {
                name,
                descricao,
                price: typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price,
                period,
                features,
                active,
                highlight,
                highlightText,
                desconto: discount,
                gradient,
            }
        });

        return NextResponse.json({
            ...plan,
            discount: plan.desconto,
            price: plan.price.toString()
        });
    } catch (error) {
        console.error("[ADMIN_PLANS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
