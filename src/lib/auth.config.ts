import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
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
