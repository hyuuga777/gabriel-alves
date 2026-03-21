import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assumindo configuração padrão de Prisma

// Esta rota de Webhook ficará disponível para o n8n enviar chamadas
export async function POST(req: Request) {
  try {
    // Pegar o Header "Authorization" que o n8n vai mandar
    const authHeader = req.headers.get('authorization');
    const secret = process.env.N8N_WEBHOOK_SECRET;

    // Verificar se a chave foi definida e bate com a que foi enviada
    if (!secret || authHeader !== `Bearer ${secret}`) {
      console.warn("Aviso: Tentativa de acesso não autorizada ao webhook do n8n.");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // =============== Lógica do n8n ===============
    // O n8n pode enviar algo como: { action: 'create_workout', userId: 'xyz', data: {...} }
    const { action, ...data } = payload;

    if (action === 'ping') {
      return NextResponse.json({ success: true, message: 'pong, webhook do n8n operando!' });
    }

    // Exemplo de integração: Caso a ação seja X, usa o Prisma para inserir algo no banco:
    // if (action === 'create_plan') {
    //   await prisma.treino.create({ data: { ... } });
    // }

    // Retornando sucesso para indicar ao n8n que a integração foi recebida.
    return NextResponse.json({ 
      success: true, 
      receivedAction: action, 
      dadosProcessados: data 
    });

  } catch (error) {
    console.error('N8n Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error ao processar chamada do n8n' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "O Webhook do n8n está vivo, mas espera chamadas POST com autenticação." });
}
