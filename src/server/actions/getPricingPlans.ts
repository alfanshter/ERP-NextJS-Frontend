'use server'

import { apiGetPricingPlans } from '@/services/PricingPlansService'
import type { PricingPlan } from '@/app/(protected-pages)/pricing-plans/types'

export const getPricingPlans = async (params?: {
    includeInactive?: boolean
}) => {
    try {
        console.log('Fetching pricing plans with params:', params)
        const response = await apiGetPricingPlans<PricingPlan[]>(params)
        console.log('Pricing plans response:', JSON.stringify(response, null, 2))
        return response
    } catch (error) {
        console.error('Error fetching pricing plans:', error)
        return []
    }
}
