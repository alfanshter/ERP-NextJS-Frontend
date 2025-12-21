import ApiService from '@/services/ApiService'
import type { CompanyListResponse } from '@/services/CompanyService'

const getCompanies = async (_queryParams: {
    [key: string]: string | string[] | undefined
}) => {
    const queryParams = _queryParams

    const {
        pageIndex = '1',
        pageSize = '10',
        sortKey = '',
        order,
        query,
        status,
    } = queryParams

    try {
        // Build query parameters
        const params: Record<string, string | number> = {
            page: parseInt(pageIndex as string),
            limit: parseInt(pageSize as string),
        }

        // Add optional filters
        if (query) {
            params.search = query as string
        }

        if (status) {
            params.status = status as string
        }

        if (sortKey) {
            params.sortBy = sortKey as string
            params.order = order === 'desc' ? 'desc' : 'asc'
        }

        // Fetch data from API
        const response = await ApiService.fetchDataWithAxios<CompanyListResponse>({
            url: '/superadmin/companies',
            method: 'get',
            params,
        })

        return response
    } catch (error) {
        console.error('Error fetching companies:', error)
        
        // Return empty data on error
        return {
            data: [],
            meta: {
                total: 0,
                page: parseInt(pageIndex as string),
                limit: parseInt(pageSize as string),
                totalPages: 0,
            },
        }
    }
}

export default getCompanies
