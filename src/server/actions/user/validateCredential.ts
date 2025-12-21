'use server'

import type { SignInCredential } from '@/@types/auth'
import authApiService from '@/services/AuthApiService'

/**
 * Validate user credentials against backend API
 * Professional implementation for production use
 */
const validateCredential = async (values: SignInCredential) => {
    try {
        const { email, password } = values

        // Call backend API for authentication
        const response = await authApiService.login({ email, password })

        // Transform backend response to NextAuth format
        return {
            id: response.user.id,
            userName: `${response.user.firstName} ${response.user.lastName}`,
            email: response.user.email,
            avatar: null, // Can be added later if backend supports avatars
            authority: [response.user.role], // Convert role to authority array
            accessToken: response.access_token, // Store token for API calls
            isSuperAdmin: response.user.isSuperAdmin,
            company: response.user.company,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
        }
    } catch (error) {
        // Log error for debugging (in production, use proper logging service)
        console.error('Authentication error:', error)

        // Return null to indicate authentication failure
        // NextAuth will handle this appropriately
        return null
    }
}

export default validateCredential
