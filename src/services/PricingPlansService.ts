import ApiService from './ApiService'

export async function apiGetPricingPlans<T>(params?: {
    includeInactive?: boolean
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/pricing-plans`,
        method: 'get',
        params,
    })
}

export async function apiGetPricingPlanById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/pricing-plans/${id}`,
        method: 'get',
    })
}

export async function apiCreatePricingPlan<T>(data: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/pricing-plans`,
        method: 'post',
        data,
    })
}

export async function apiUpdatePricingPlan<T>(id: string, data: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/pricing-plans/${id}`,
        method: 'patch',
        data,
    })
}

export async function apiDeletePricingPlan<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/pricing-plans/${id}`,
        method: 'delete',
    })
}
