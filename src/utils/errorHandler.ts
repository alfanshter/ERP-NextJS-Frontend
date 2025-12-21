/**
 * Error Handler Utility
 * Professional error handling and user-friendly messages
 */

export interface ApiError {
    statusCode: number
    message: string | string[]
    error?: string
    data?: unknown
}

/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error: unknown): string {
    // Handle API errors
    if (isApiError(error)) {
        if (Array.isArray(error.message)) {
            return formatValidationErrors(error.message)
        }
        return error.message
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return 'Network error. Please check your internet connection.'
    }

    // Handle generic errors
    if (error instanceof Error) {
        return error.message
    }

    // Unknown error
    return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is an API error
 */
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'statusCode' in error &&
        'message' in error
    )
}

/**
 * Format validation errors into user-friendly message
 */
export function formatValidationErrors(messages: string[]): string {
    if (messages.length === 0) {
        return 'Validation error'
    }

    // Group errors by field
    const fieldErrors: Record<string, string[]> = {}

    messages.forEach((msg) => {
        const field = extractFieldName(msg)
        if (!fieldErrors[field]) {
            fieldErrors[field] = []
        }
        fieldErrors[field].push(msg)
    })

    // Format each field's errors
    const formattedErrors: string[] = []

    Object.entries(fieldErrors).forEach(([field, errors]) => {
        const fieldName = capitalizeFirstLetter(field)

        if (errors.some((e) => e.includes('should not be empty'))) {
            formattedErrors.push(`${fieldName} is required`)
        } else if (errors.some((e) => e.includes('must be an email'))) {
            formattedErrors.push('Please enter a valid email address')
        } else if (errors.some((e) => e.includes('longer than or equal'))) {
            const match = errors[0].match(/(\d+)/)
            const minLength = match ? match[1] : '6'
            formattedErrors.push(
                `${fieldName} must be at least ${minLength} characters`,
            )
        } else {
            formattedErrors.push(errors[0])
        }
    })

    return formattedErrors.join('. ')
}

/**
 * Extract field name from validation error message
 */
function extractFieldName(message: string): string {
    const match = message.match(/^(\w+)/)
    return match ? match[1] : 'field'
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Get HTTP status text
 */
export function getStatusText(statusCode: number): string {
    const statusTexts: Record<number, string> = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        422: 'Unprocessable Entity',
        429: 'Too Many Requests',
        500: 'Internal Server Error',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
    }

    return statusTexts[statusCode] || 'Error'
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
    if (!isApiError(error)) return false
    return error.statusCode === 401 || error.statusCode === 403
}

/**
 * Check if error is validation error
 */
export function isValidationError(error: unknown): boolean {
    if (!isApiError(error)) return false
    return error.statusCode === 400 || error.statusCode === 422
}

/**
 * Check if error is server error
 */
export function isServerError(error: unknown): boolean {
    if (!isApiError(error)) return false
    return error.statusCode >= 500
}
