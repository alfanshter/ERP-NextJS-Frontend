/**
 * Authenticated API Service
 * Professional-grade service for making authenticated requests to backend
 * Automatically handles JWT token from session
 */

import { auth } from '@/auth'

export interface ApiRequestOptions extends RequestInit {
    useAuth?: boolean
    token?: string
}

class ApiClient {
    private baseUrl: string

    constructor() {
        this.baseUrl =
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    }

    /**
     * Make authenticated API request
     * Automatically includes JWT token from session
     */
    async request<T>(
        endpoint: string,
        options: ApiRequestOptions = {},
    ): Promise<T> {
        const { useAuth = true, token, ...fetchOptions } = options

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // Merge with provided headers
        if (fetchOptions.headers) {
            const providedHeaders = fetchOptions.headers as Record<
                string,
                string
            >
            Object.assign(headers, providedHeaders)
        }

        // Add authentication token if required
        if (useAuth) {
            let authToken = token

            // Get token from session if not provided
            if (!authToken) {
                const session = await auth()
                authToken = session?.user?.accessToken
            }

            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`
            }
        }

        const url = endpoint.startsWith('http')
            ? endpoint
            : `${this.baseUrl}${endpoint}`

        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            cache: fetchOptions.cache || 'no-store',
        })

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            return (await response.text()) as unknown as T
        }

        const data = await response.json()

        // Handle error responses
        if (!response.ok) {
            throw {
                statusCode: response.status,
                message: data.message || response.statusText,
                error: data.error || 'RequestError',
                data,
            }
        }

        return data as T
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'GET',
        })
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        body?: unknown,
        options?: ApiRequestOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        })
    }

    /**
     * DELETE request
     */
    async delete<T>(
        endpoint: string,
        options?: ApiRequestOptions,
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'DELETE',
        })
    }
}

// Singleton instance
export const apiClient = new ApiClient()

export default apiClient
