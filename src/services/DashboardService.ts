import ApiService from './ApiService'

export async function apiGetDashboardOverview<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: `/superadmin/dashboard/overview`,
        method: 'get',
    })
}
