import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const planos = await prisma.plano.findMany({
            orderBy: { createdAt: 'asc' }
        });
        
        const plans = planos.map(p => ({
            id: p.id,
            name: p.nome,
            price: p.preco.toString(),
            period: p.intervalo,
            features: p.recursos,
            highlight: p.destaque,
            highlightText: p.textoDestaque,
            discount: p.desconto,
            gradient: p.gradiente
        }));

        return NextResponse.json(plans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const newPlano = await prisma.plano.create({
            data: {
                nome: body.name,
                preco: parseFloat(body.price.replace(',', '.')),
                intervalo: body.period || 'mês',
                recursos: body.features || [],
                destaque: body.highlight || false,
                textoDestaque: body.highlightText || null,
                desconto: body.discount || null,
                gradiente: body.gradient || false,
                ativo: true,
                descricao: ''
            }
        });

        const newPlan = {
            id: newPlano.id,
            name: newPlano.nome,
            price: newPlano.preco.toString(),
            period: newPlano.intervalo,
            features: newPlano.recursos,
            highlight: newPlano.destaque,
            highlightText: newPlano.textoDestaque,
            discount: newPlano.desconto,
            gradient: newPlano.gradiente
        };

        return NextResponse.json(newPlan);
    } catch (error) {
        console.error('Error creating plan:', error);
        return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }
}
