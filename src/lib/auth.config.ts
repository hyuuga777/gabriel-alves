import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    trustHost: true, // Necessário quando em deploy atrás de proxy como o Traefik do Coolify
    secret: process.env.AUTH_SECRET || "fallback_secret_for_development_only_1234567890", // Previne erro 500 se variável não estiver definida
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
                token.avatar = user.avatar
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.avatar = token.avatar as string | null
            }
            return session
        }
    },
    providers: [], // Providers são configurados no auth.ts para suportar Edge
} satisfies NextAuthConfig;

export const { auth } = NextAuth(authConfig);
