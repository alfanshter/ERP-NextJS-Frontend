export type DiscountType = 'PERCENTAGE' | 'FIXED'

export type PricingPlan = {
    id: string
    name: string
    description: string | null
    monthlyPrice: number
    yearlyPrice: number
    monthlyDiscount: number
    yearlyDiscount: number
    discountType: DiscountType
    features: string[]
    maxUsers: number | null
    maxProjects: number | null
    maxStorage: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    finalMonthlyPrice: number
    finalYearlyPrice: number
    subscriptions?: unknown[]
    _count?: {
        subscriptions: number
    }
}

export type PricingPlanFilter = {
    includeInactive?: boolean
}
