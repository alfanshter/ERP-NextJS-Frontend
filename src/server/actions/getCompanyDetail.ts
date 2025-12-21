'use server'

import { getCompanyById } from '@/services/CompanyService'
import type { CompanyDetail } from '@/app/(protected-pages)/company/types'

const getCompanyDetail = async (params: {
    id: string
}): Promise<CompanyDetail | Record<string, never>> => {
    try {
        const response = await getCompanyById(params.id)
        return response
    } catch (error) {
        console.error('Error fetching company detail:', error)
        return {}
    }
}

export default getCompanyDetail
