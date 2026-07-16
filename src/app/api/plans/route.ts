// @ts-nocheck
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const planos = await prisma.plano.findMany({
      where: { ativo: true },
      orderBy: { preco: 'asc' }
    });
    
    // Map database fields to frontend names
    const mappedPlans = planos.map(p => {
      let parsedFeatures = [];
      try {
        parsedFeatures = JSON.parse(p.recursos);
      } catch (e) {
        if (typeof p.recursos === 'string') {
          parsedFeatures = p.recursos.split(',').map(f => f.trim());
        }
      }

      return {
        id: p.id,
        name: p.nome,
        descricao: p.descricao,
        price: p.preco.toString(),
        period: p.intervalo,
        features: parsedFeatures,
        highlight: p.destaque,
        highlightText: p.textoDestaque,
        gradient: p.gradiente,
        discount: p.desconto
      };
    });
    
    return NextResponse.json(mappedPlans);
  } catch (error) {
    console.error('Error fetching plans from DB, falling back to plans.json:', error);
    try {
      const filePath = path.join(process.cwd(), 'plans.json');
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const staticPlans = JSON.parse(fileData);
        return NextResponse.json(staticPlans);
      }
    } catch (fallbackError) {
      console.error('Error loading fallback plans:', fallbackError);
    }

    // Direct fallback array of plans matching user requests in adm.txt
    return NextResponse.json([
      {
        id: "plano-basic",
        name: "Plano Basic",
        descricao: "Acesso essencial aos treinos e suporte básico.",
        price: "129,90",
        period: "/mês",
        features: [
          "Treino personalizado",
          "Check-in a cada 15 dias",
          "Ajustes periódicos do planejamento",
          "Correção de execução dos exercícios (até 3 vídeos por semana)",
          "Suporte para dúvidas"
        ],
        highlight: false,
        highlightText: null,
        gradient: false,
        discount: null
      },
      {
        id: "plano-ultra",
        name: "Plano Ultra",
        descricao: "Treinamento completo com acompanhamento premium.",
        price: "199,90",
        period: "/mês",
        features: [
          "Treino personalizado",
          "Check-in semanal",
          "Acompanhamento mais próximo da evolução",
          "Correção de execução ilimitada de vídeos",
          "Ajustes estratégicos constantes",
          "Possibilidade de chamada para alinhamento"
        ],
        highlight: true,
        highlightText: "RECOMENDADO",
        gradient: true,
        discount: null
      }
    ]);
  }
}

