import type { NextAuthConfig } from 'next-auth'
import validateCredential from '../server/actions/user/validateCredential'
import Credentials from 'next-auth/providers/credentials'
import Github from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import type { SignInCredential } from '@/@types/auth'

export default {
    providers: [
        Github({
            clientId: process.env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                /** Validate credentials from backend API */
                const user = await validateCredential(
                    credentials as SignInCredential,
                )
                if (!user) {
                    return null
                }
                return {
                    id: user.id,
                    name: user.userName,
                    email: user.email,
                    image: user.avatar,
                    authority: user.authority,
                    accessToken: user.accessToken,
                    isSuperAdmin: user.isSuperAdmin,
                    company: user.company,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Persist user data to token on signin
            if (user) {
                token.authority = user.authority
                token.accessToken = user.accessToken
                token.isSuperAdmin = user.isSuperAdmin
                token.company = user.company
                token.firstName = user.firstName
                token.lastName = user.lastName
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    authority: token.authority as string[],
                    accessToken: token.accessToken as string,
                    isSuperAdmin: token.isSuperAdmin as boolean,
                    company: token.company as string | null,
                    firstName: token.firstName as string,
                    lastName: token.lastName as string,
                },
            }
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days (match backend JWT expiry)
    },
} satisfies NextAuthConfig
