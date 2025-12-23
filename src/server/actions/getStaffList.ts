'use server'

import { apiGetStaffList } from '@/services/CustomersService'
import type { GetStaffListResponse } from '@/app/(protected-pages)/users/types'

export async function getStaffList(params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
}): Promise<GetStaffListResponse> {
    try {
        const response = await apiGetStaffList<GetStaffListResponse>({
            page: params.page || 1,
            limit: params.limit || 10,
            ...params,
        })
        return response
    } catch (error) {
        console.error('Error fetching staff list:', error)
        throw error
    }
}
