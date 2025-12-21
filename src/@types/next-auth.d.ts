import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            authority: string[]
            accessToken: string
            isSuperAdmin: boolean
            company: string | null
            firstName: string
            lastName: string
        } & DefaultSession['user']
    }

    interface User extends DefaultUser {
        authority: string[]
        accessToken: string
        isSuperAdmin: boolean
        company: string | null
        firstName: string
        lastName: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        authority: string[]
        accessToken: string
        isSuperAdmin: boolean
        company: string | null
        firstName: string
        lastName: string
    }
}