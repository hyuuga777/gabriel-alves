// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const planos = await prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { preco: 'asc' }
    });
    
    // Map database fields to frontend names
    const mappedPlans = planos.map(p => ({
      id: p.id,
      name: p.nome,
      descricao: p.descricao,
      price: p.preco.toString(),
      period: p.intervalo,
      features: p.recursos,
      highlight: p.destaque,
      highlightText: p.textoDestaque,
      gradient: p.gradiente,
      discount: p.desconto
    }));
    
    return NextResponse.json(mappedPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
