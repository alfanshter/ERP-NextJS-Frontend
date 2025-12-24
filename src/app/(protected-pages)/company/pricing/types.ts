export type PaymentCycle = 'monthly' | 'annually'

export type DiscountType = 'PERCENTAGE' | 'FIXED'

export type SelectedPlan = {
    planName: string
    planId: string
    paymentCycle: PaymentCycle
    price: {
        monthly: number
        annually: number
    }
    finalPrice: {
        monthly: number
        annually: number
    }
    discount: {
        monthly: number
        annually: number
    }
    discountType: DiscountType
}

export type PlanData = {
    id: string
    name: string
    description: string
    price: {
        monthly: number
        annually: number
    }
    originalPrice: {
        monthly: number
        annually: number
    }
    discount: {
        monthly: number
        annually: number
    }
    discountType: DiscountType
    features: string[]
    recommended: boolean
    maxUsers: number | null
    maxProjects: number | null
    maxStorage: number | null
}

export type GetPricingPanResponse = {
    featuresModel: {
        id: string
        description: string
    }[]
    plans: PlanData[]
}
