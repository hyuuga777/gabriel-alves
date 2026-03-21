import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedPlano = await prisma.plano.update({
            where: { id },
            data: {
                nome: body.name,
                preco: parseFloat(body.price.toString().replace(',', '.')),
                intervalo: body.period,
                recursos: body.features,
                destaque: body.highlight,
                textoDestaque: body.highlightText || null,
                desconto: body.discount || null,
                gradiente: body.gradient
            }
        });

        return NextResponse.json({
            id: updatedPlano.id,
            name: updatedPlano.nome,
            price: updatedPlano.preco.toString(),
            period: updatedPlano.intervalo,
            features: updatedPlano.recursos,
            highlight: updatedPlano.destaque,
            highlightText: updatedPlano.textoDestaque,
            discount: updatedPlano.desconto,
            gradient: updatedPlano.gradiente
        });
    } catch (error) {
        console.error('Error updating plan:', error);
        return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.plano.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }
}
