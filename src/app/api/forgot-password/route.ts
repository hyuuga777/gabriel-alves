import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordRecoveryEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (user && user.email) {
      // Gerar token seguro de 32 bytes
      const token = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000); // 1 hora de validade

      // Salvar token no banco
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpiry: expiry
        }
      });

      // Enviar e-mail de recuperação
      await sendPasswordRecoveryEmail({
        to: user.email,
        name: user.name,
        token: token
      });
    }

    // Retorna mensagem padrão para evitar enumeração de e-mails
    return NextResponse.json({
      message: 'Se o e-mail estiver cadastrado, um link de redefinição de senha será enviado.'
    });

  } catch (error) {
    console.error('Erro na rota forgot-password:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
