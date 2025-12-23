'use server'

import { apiGetDashboardOverview } from '@/services/DashboardService'
import type { DashboardOverview } from '@/app/(protected-pages)/dashboard/types'

export const getSuperadminDashboard = async () => {
    try {
        const response = await apiGetDashboardOverview<DashboardOverview>()
        return response
    } catch (error) {
        console.error('Error fetching dashboard overview:', error)
        return null
    }
}
