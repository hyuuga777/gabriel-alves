import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()

        // Validações
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'A senha deve ter pelo menos 6 caracteres' },
                { status: 400 }
            )
        }

        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email já está cadastrado' },
                { status: 400 }
            )
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10)

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ALUNO', // Por padrão é aluno
            }
        })

        // Enviar e-mail de boas-vindas assincronamente (sem travar resposta se falhar)
        import('../../../lib/mail').then(({ sendWelcomeEmail }) => {
            sendWelcomeEmail({ to: user.email!, name: user.name, email: user.email! }).catch(console.error);
        });

        return NextResponse.json({
            message: 'Conta criada com sucesso',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }, { status: 201 })

    } catch (error) {
        console.error('Erro ao criar usuário:', error)
        return NextResponse.json(
            { error: 'Erro ao criar conta' },
            { status: 500 }
        )
    }
}
