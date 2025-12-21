/**
 * Authentication API Service
 * Professional-grade API service for ERP authentication
 * Handles login, token management, and error handling
 */

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    access_token: string
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
        role: string
        company: string | null
        isSuperAdmin: boolean
    }
}

export interface ApiErrorResponse {
    statusCode: number
    message: string | string[]
    error?: string
}

class AuthApiService {
    private baseUrl: string

    constructor() {
        this.baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    }

    /**
     * Login user with credentials
     * @param credentials - Email and password
     * @returns Login response with token and user data
     * @throws ApiErrorResponse on failure
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                cache: 'no-store',
            })

            const data = await response.json()

            if (!response.ok) {
                throw this.handleErrorResponse(data, response.status)
            }

            return data as LoginResponse
        } catch (error) {
            if (error instanceof Error && 'statusCode' in error) {
                throw error
            }
            throw {
                statusCode: 500,
                message: 'Network error. Please check your connection.',
                error: 'NetworkError',
            } as ApiErrorResponse
        }
    }

    /**
     * Get current user profile
     * @param token - JWT access token
     * @returns User profile data
     */
    async getProfile(token: string): Promise<LoginResponse['user']> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                cache: 'no-store',
            })

            const data = await response.json()

            if (!response.ok) {
                throw this.handleErrorResponse(data, response.status)
            }

            return data
        } catch (error) {
            if (error instanceof Error && 'statusCode' in error) {
                throw error
            }
            throw {
                statusCode: 500,
                message: 'Failed to fetch user profile',
                error: 'ProfileError',
            } as ApiErrorResponse
        }
    }

    /**
     * Handle API error responses
     * @param data - Error response data
     * @param status - HTTP status code
     * @returns Formatted error object
     */
    private handleErrorResponse(
        data: ApiErrorResponse,
        status: number,
    ): ApiErrorResponse {
        // Handle validation errors (400)
        if (status === 400) {
            const messages = Array.isArray(data.message)
                ? data.message
                : [data.message]

            return {
                statusCode: 400,
                message: this.formatValidationErrors(messages),
                error: 'ValidationError',
            }
        }

        // Handle authentication errors (401)
        if (status === 401) {
            return {
                statusCode: 401,
                message: 'Invalid email or password',
                error: 'AuthenticationError',
            }
        }

        // Handle forbidden errors (403)
        if (status === 403) {
            return {
                statusCode: 403,
                message: 'Access denied. Insufficient permissions.',
                error: 'ForbiddenError',
            }
        }

        // Handle not found errors (404)
        if (status === 404) {
            return {
                statusCode: 404,
                message: 'Resource not found',
                error: 'NotFoundError',
            }
        }

        // Handle server errors (500+)
        if (status >= 500) {
            return {
                statusCode: status,
                message: 'Server error. Please try again later.',
                error: 'ServerError',
            }
        }

        // Default error
        return {
            statusCode: status,
            message: data.message || 'An unexpected error occurred',
            error: data.error || 'UnknownError',
        }
    }

    /**
     * Format validation error messages for user display
     * @param messages - Array of validation error messages
     * @returns Formatted error message
     */
    private formatValidationErrors(messages: string[]): string {
        if (messages.length === 0) {
            return 'Validation error'
        }

        // Group errors by field
        const emailErrors = messages.filter((msg) => msg.includes('email'))
        const passwordErrors = messages.filter((msg) =>
            msg.includes('password'),
        )

        const errors: string[] = []

        if (emailErrors.length > 0) {
            if (emailErrors.some((e) => e.includes('should not be empty'))) {
                errors.push('Email is required')
            } else if (emailErrors.some((e) => e.includes('must be an email'))) {
                errors.push('Please enter a valid email address')
            }
        }

        if (passwordErrors.length > 0) {
            if (
                passwordErrors.some((e) => e.includes('should not be empty'))
            ) {
                errors.push('Password is required')
            } else if (
                passwordErrors.some((e) => e.includes('longer than or equal'))
            ) {
                errors.push('Password must be at least 6 characters')
            }
        }

        return errors.length > 0 ? errors.join('. ') : messages.join('. ')
    }

    /**
     * Validate token by fetching user profile
     * @param token - JWT access token
     * @returns True if token is valid
     */
    async validateToken(token: string): Promise<boolean> {
        try {
            await this.getProfile(token)
            return true
        } catch {
            return false
        }
    }
}

// Singleton instance
export const authApiService = new AuthApiService()

export default authApiService
