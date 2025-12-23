export type BillingPeriod = 'MONTHLY' | 'YEARLY' | 'LIFETIME'

export type PricingPlan = {
    id: string
    name: string
    description: string | null
    price: number
    billingPeriod: BillingPeriod
    features: string[]
    maxUsers: number | null
    maxProjects: number | null
    maxStorage: number | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    subscriptions?: unknown[]
    _count?: {
        subscriptions: number
    }
}

export type PricingPlanFilter = {
    includeInactive?: boolean
}
