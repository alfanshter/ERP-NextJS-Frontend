import ApiService from './ApiService'
import type { Company, CompanyDetail, CreateCompanyData, UpdateCompanyData } from '@/app/(protected-pages)/company/types'

/**
 * Company API Service
 * Handles all company-related API calls
 */

export type CompanyListResponse = {
    data: Company[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type CompanyResponse = {
    data: Company
}

/**
 * Get list of companies with pagination and filters
 */
export async function getCompanies(params?: Record<string, string | number>) {
    return ApiService.fetchDataWithAxios<CompanyListResponse>({
        url: '/superadmin/companies',
        method: 'get',
        params,
    })
}

/**
 * Get company detail by ID
 */
export async function getCompanyById(id: string) {
    return ApiService.fetchDataWithAxios<CompanyDetail>({
        url: `/superadmin/companies/${id}`,
        method: 'get',
    })
}

/**
 * Create new company with logo upload
 * Uses FormData for multipart/form-data upload
 */
export async function createCompany(data: CreateCompanyData): Promise<{
    success: boolean
    data?: Company
    message?: string
}> {
    try {
        // Create FormData for file upload
        const formData = new FormData()
        
        // Add text fields
        formData.append('name', data.name)
        if (data.email) formData.append('email', data.email)
        if (data.phone) formData.append('phone', data.phone)
        if (data.address) formData.append('address', data.address)
        if (data.website) formData.append('website', data.website)
        formData.append('status', data.status)
        
        // Add logo file if exists
        if (data.logo instanceof File) {
            formData.append('logo', data.logo)
        }

        const response = await ApiService.fetchDataWithAxios<Company>({
            url: '/superadmin/companies',
            method: 'post',
            data: formData as unknown as Record<string, unknown>,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return {
            success: true,
            data: response,
        }
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } }
        console.error('Error creating company:', error)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to create company',
        }
    }
}

/**
 * Update company with optional logo upload (PATCH - partial update)
 */
export async function updateCompany(
    id: string,
    data: UpdateCompanyData,
): Promise<{
    success: boolean
    data?: Company
    message?: string
}> {
    try {
        // Create FormData for file upload
        const formData = new FormData()
        
        // Add text fields only if they exist (partial update)
        if (data.name !== undefined) formData.append('name', data.name)
        if (data.email !== undefined) formData.append('email', data.email)
        if (data.phone !== undefined) formData.append('phone', data.phone)
        if (data.address !== undefined) formData.append('address', data.address)
        if (data.website !== undefined) formData.append('website', data.website)
        if (data.status !== undefined) formData.append('status', data.status)
        
        // Add logo file if exists
        if (data.logo instanceof File) {
            formData.append('logo', data.logo)
        }

        const response = await ApiService.fetchDataWithAxios<Company>({
            url: `/superadmin/companies/${id}`,
            method: 'patch',
            data: formData as unknown as Record<string, unknown>,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return {
            success: true,
            data: response,
        }
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } }
        console.error('Error updating company:', error)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to update company',
        }
    }
}

/**
 * Delete company by ID
 */
export async function deleteCompany(id: string): Promise<{
    success: boolean
    message?: string
}> {
    try {
        await ApiService.fetchDataWithAxios({
            url: `/superadmin/companies/${id}`,
            method: 'delete',
        })

        return {
            success: true,
        }
    } catch (error) {
        const err = error as { response?: { data?: { message?: string } } }
        console.error('Error deleting company:', error)
        return {
            success: false,
            message: err.response?.data?.message || 'Failed to delete company',
        }
    }
}
