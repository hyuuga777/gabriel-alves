import { auth } from "@/lib/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const { pathname } = request.nextUrl

    // Rotas psblicas
    const publicRoutes = ['/', '/login', '/cadastro', '/assinar', '/contato', '/como-funciona', '/checkout', '/esqueci-senha']
    const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

    // Se não está autenticado e tentando acessar rota privada
    if (!session && !isPublicRoute && !pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se está autenticado
    if (session?.user) {
        const userRole = session.user.role

        // Redirecionamento baseado em role
        if (pathname === '/dashboard') {
            if (userRole === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/painel', request.url))
            }
            if (userRole === 'ALUNO') {
                return NextResponse.redirect(new URL('/aluno/dashboard', request.url))
            }
        }

        // Proteção de rotas do admin
        if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/aluno/dashboard', request.url))
        }

        // Proteção de rotas do aluno
        if (pathname.startsWith('/aluno') && userRole === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/painel', request.url))
        }

        // Se está na home ou login/cadastro, redirecionar para dashboard apropriado
        if (pathname === '/' || pathname === '/login' || pathname === '/cadastro') {
            if (userRole === 'ADMIN') {
                return NextResponse.redirect(new URL('/admin/painel', request.url))
            }
            if (userRole === 'ALUNO') {
                return NextResponse.redirect(new URL('/aluno/dashboard', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
