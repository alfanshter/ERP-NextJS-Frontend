'use server'

import { apiGetStaffById } from '@/services/CustomersService'
import type { Staff } from '@/app/(protected-pages)/users/types'

export async function getStaffDetail(id: string): Promise<Staff> {
    try {
        const response = await apiGetStaffById<Staff>(id)
        return response
    } catch (error) {
        console.error('Error fetching staff detail:', error)
        throw error
    }
}
