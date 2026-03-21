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
                createdAt: 'desc'
            }
        });

        return NextResponse.json(plans);
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

        const plano = await prisma.plano.create({
            data: {
                name,
                descricao: descricao || '',
                price: typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price,
                period,
                features: features || [],
                active: active ?? true,
                highlight: highlight ?? false,
                highlightText,
                desconto: discount,
                gradient: gradient ?? false
            }
        });

        return NextResponse.json(plano);
    } catch (error) {
        console.error("[ADMIN_PLANS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
