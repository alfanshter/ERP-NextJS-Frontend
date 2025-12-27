import ApiService from './ApiService'

export async function apiGetEmployeeList<T>(params: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
}) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/company/employees`,
        method: 'get',
        params,
    })
}

export async function apiGetEmployeeById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/company/employees/${id}`,
        method: 'get',
    })
}

export async function apiCreateEmployee<T>(data: FormData) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/company/employees',
        method: 'post',
        data: data as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiUpdateEmployee<T>(id: string, data: FormData) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/company/employees/${id}`,
        method: 'patch',
        data: data as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiDeleteEmployee<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/company/employees/${id}`,
        method: 'delete',
    })
}

export async function apiBulkDeleteEmployee<T>(ids: string[]) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/company/employees/bulk-delete',
        method: 'post',
        data: { ids },
    })
}
