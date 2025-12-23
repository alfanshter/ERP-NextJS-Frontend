import ApiService from './ApiService'

export async function apiGetStaffList<T>(params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff`,
        method: 'get',
        params,
    })
}

export async function apiGetStaffById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff/${id}`,
        method: 'get',
    })
}

export async function apiCreateStaff<T>(data: FormData) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff`,
        method: 'post',
        data: data as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiUpdateStaff<T>(id: string, data: FormData) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff/${id}`,
        method: 'patch',
        data: data as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiDeleteStaff<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff/${id}`,
        method: 'delete',
    })
}

export async function apiBulkDeleteStaff<T>(ids: string[]) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/staff/bulk-delete`,
        method: 'post',
        data: { ids },
    })
}

export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customers/log`,
        method: 'get',
        params,
    })
}

export async function apiGetCustomers<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customers`,
        method: 'get',
        params,
    })
}

