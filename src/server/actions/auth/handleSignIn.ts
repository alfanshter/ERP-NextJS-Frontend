'use server'

import { signIn } from '@/auth'
import appConfig from '@/configs/app.config'
import { AuthError } from 'next-auth'
import type { SignInCredential } from '@/@types/auth'

export const onSignInWithCredentials = async (
    { email, password }: SignInCredential,
    callbackUrl?: string,
) => {
    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || appConfig.authenticatedEntryPath,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            /** Handle authentication errors from NextAuth */
            switch (error.type) {
                case 'CredentialsSignin':
                    // This occurs when backend returns null from validateCredential
                    return {
                        error: 'Invalid email or password. Please check your credentials and try again.',
                    }
                case 'CallbackRouteError':
                    // Handle callback errors (might include backend validation errors)
                    return {
                        error: 'Authentication failed. Please check your credentials.',
                    }
                default:
                    return {
                        error: 'Authentication error. Please try again.',
                    }
            }
        }

        // Handle unexpected errors
        console.error('Unexpected sign-in error:', error)
        throw error
    }
}
