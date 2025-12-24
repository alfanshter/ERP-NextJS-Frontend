'use server'

import { getCompanyUsers } from '@/services/CompanyService'
import type { CompanyUsersResponse } from '@/app/(protected-pages)/company/types'

export default async function getCompanyUsersAction(params: {
    companyId: string
    page?: number
    limit?: number
}) {
    const { companyId, page = 1, limit = 10 } = params

    try {
        const response = await getCompanyUsers(companyId, { page, limit })
        return response as CompanyUsersResponse
    } catch (error) {
        console.error('Error fetching company users:', error)
        return {
            data: [],
            meta: {
                total: 0,
                page,
                limit,
                totalPages: 0,
            },
        } satisfies CompanyUsersResponse
    }
}
