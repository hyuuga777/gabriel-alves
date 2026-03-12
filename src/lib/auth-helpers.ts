/**
 * auth-helpers.ts
 * Helpers server-side para autenticação e multi-tenancy.
 * Compatível com NextAuth v5 (next-auth@5.x).
 * Use em API Routes e Server Actions para garantir isolamento de dados.
 */

import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export type UserRole = 'ALUNO' | 'TREINADOR' | 'ADMIN';

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

/**
 * Obtém a sessão atual e lança resposta 401/403 se não autenticado ou sem a role correta.
 *
 * @example
 * // Em qualquer route handler:
 * const session = await requireRole('TREINADOR');
 * // Agora use session.userId como treinadorId em todas as queries
 * const treinos = await prisma.treino.findMany({ where: { treinadorId: session.userId } });
 */
export async function requireRole(
  ...allowedRoles: UserRole[]
): Promise<AuthSession> {
  const session = await auth();

  if (!session?.user) {
    throw new AuthError(401, 'Não autenticado. Faça login para continuar.');
  }

  const role = (session.user as { role?: string }).role as UserRole | undefined;

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    throw new AuthError(
      403,
      `Acesso negado. Rota requer: ${allowedRoles.join(' ou ')}.`
    );
  }

  return {
    userId: session.user.id as string,
    email: session.user.email!,
    name: session.user.name!,
    role: role!,
  };
}

/**
 * Versão que retorna NextResponse em vez de lançar erro.
 * Útil para routes que preferem retornar JSON diretamente.
 *
 * @example
 * const result = await requireRoleSafe('TREINADOR');
 * if (result instanceof NextResponse) return result; // 401/403
 * const { userId } = result;
 */
export async function requireRoleSafe(
  ...allowedRoles: UserRole[]
): Promise<AuthSession | NextResponse> {
  try {
    return await requireRole(...allowedRoles);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

/**
 * Verifica se um aluno pertence a um treinador específico.
 * Garante que TREINADOR só acessa dados dos seus próprios alunos.
 *
 * @example
 * await assertAlunoDoTreinador(alunoId, session.userId);
 */
export async function assertAlunoDoTreinador(
  alunoId: string,
  treinadorId: string
): Promise<void> {
  const vinculo = await prisma.atribuicaoTreino.findFirst({
    where: {
      alunoId,
      treino: {
        treinadorId,
      },
    },
    select: { id: true },
  });

  if (!vinculo) {
    throw new AuthError(
      403,
      'Acesso negado: este aluno não pertence ao seu cadastro.'
    );
  }
}

/** Erro de autenticação estruturado para conversão em HTTP response. */
export class AuthError extends Error {
  constructor(
    public readonly statusCode: 401 | 403,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
