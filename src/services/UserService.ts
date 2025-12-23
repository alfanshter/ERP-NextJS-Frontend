import ApiService from './ApiService'

export type CreateUserData = {
    email: string
    password: string
    firstName: string
    lastName: string
    companyId: string
}

export type User = {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar: string | null
    phone: string | null
    isActive: boolean
    companyId: string
    roleId: string
    lastLoginAt: string | null
    createdAt: string
    updatedAt: string
    role: {
        id: string
        name: string
        description: string
        permissions: string[]
        isSystem: boolean
        createdAt: string
        updatedAt: string
    }
    company: {
        id: string
        name: string
        email: string
        phone: string
        address: string
        logo: string | null
        website: string | null
        status: string
        subscriptionId: string | null
        createdAt: string
        updatedAt: string
    }
}

/**
 * Create new user for a company
 */
export async function createUser(data: CreateUserData): Promise<{
    success: boolean
    data?: User
    message?: string
}> {
    try {
        const response = await ApiService.fetchDataWithAxios<User>({
            url: '/auth/register',
            method: 'post',
            data: data,
        })

        return {
            success: true,
            data: response,
        }
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } }
        console.error('Error creating user:', error)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to create user',
        }
    }
}
