'use server'

import { apiGetEmployeeList } from '@/services/EmployeeService'
import type { GetEmployeeListResponse } from '@/app/(protected-pages)/employees/types'

type GetEmployeeListParams = {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
}

export async function getEmployeeList(params: GetEmployeeListParams) {
    try {
        const response = await apiGetEmployeeList<GetEmployeeListResponse>(params)
        return response
    } catch (error) {
        console.error('Error fetching employee list:', error)
        return {
            data: [],
            meta: {
                total: 0,
                page: params.page || 1,
                limit: params.limit || 10,
                totalPages: 0,
            },
        }
    }
}
