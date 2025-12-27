import ApiService from './ApiService'

export type RegionSearchResult = {
    id: string
    fullName: string
    postalCode: string | null
    latitude: number | null
    longitude: number | null
    village: string
    district: string
    city: string
    province: string
}

export async function apiSearchRegions(query: string, limit: number = 10) {
    return ApiService.fetchDataWithAxios<RegionSearchResult[]>({
        url: '/regions/search',
        method: 'get',
        params: { q: query, limit },
    })
}

export async function apiGetNotificationCount() {
    return ApiService.fetchDataWithAxios<{
        count: number
    }>({
        url: '/notifications/count',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.fetchDataWithAxios<
        {
            id: string
            target: string
            description: string
            date: string
            image: string
            type: number
            location: string
            locationLabel: string
            status: string
            readed: boolean
        }[]
    >({
        url: '/notifications',
        method: 'get',
    })
}

export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/search',
        method: 'get',
        params,
    })
}
