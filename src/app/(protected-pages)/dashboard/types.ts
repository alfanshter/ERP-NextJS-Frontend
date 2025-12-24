export type Period = 'thisMonth' | 'thisWeek' | 'thisYear'

export type StatisticCategory = 'totalProfit' | 'totalOrder' | 'totalImpression'

// Dashboard Overview Types for Superadmin
export type DashboardStats = {
    totalCompanies: number
    activeCompanies: number
    totalUsers: number
    totalPlans: number
    activeSubscriptions: number
}

export type CompanyStatus = 'ACTIVE' | 'TRIAL' | 'INACTIVE' | 'SUSPENDED'

export type RecentCompany = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    logo: string | null
    website: string | null
    status: CompanyStatus
    subscriptionId: string | null
    createdAt: string
    updatedAt: string
    subscription: {
        id: string
        planId: string
        billingPeriod: 'MONTHLY' | 'YEARLY'
        price: number
        status: string
        startDate: string
        endDate: string | null
        trialEndDate: string | null
        autoRenew: boolean
        lastPaymentAt: string | null
        nextBillingAt: string | null
        createdAt: string
        updatedAt: string
        plan: {
            id: string
            name: string
            description: string
            monthlyPrice: number
            yearlyPrice: number
            monthlyDiscount: number
            yearlyDiscount: number
            discountType: 'PERCENTAGE' | 'FIXED'
            features: string[]
            maxUsers: number | null
            maxProjects: number | null
            maxStorage: number | null
            isActive: boolean
            createdAt: string
            updatedAt: string
        }
    } | null
    _count: {
        users: number
    }
}

export type DashboardRevenue = {
    monthlyRevenue: number
    yearlyRevenue: number
    activeSubscriptions: number
}

export type DashboardOverview = {
    stats: DashboardStats
    recentCompanies: RecentCompany[]
    revenue: DashboardRevenue
}

export type ChannelRevenue = Record<
    Period,
    {
        value: number
        growShrink: number
        percentage: {
            onlineStore: number
            physicalStore: number
            socialMedia: number
        }
    }
>

export type SalesTargetData = Record<
    Period,
    {
        target: number
        achieved: number
        percentage: number
    }
>

export type Product = {
    id: string
    name: string
    productCode: string
    img: string
    sales: number
    growShrink: number
}

export type CustomerDemographicData = {
    id: string
    name: string
    value: number
    coordinates: [number, number]
}

export type PeriodData = {
    value: number
    growShrink: number
    comparePeriod: string
    chartData: {
        series: {
            name: string
            data: number[]
        }[]
        date: string[]
    }
}

export type StatisticData = Record<
    StatisticCategory,
    Record<Period, PeriodData>
>

export type Order = {
    id: string
    date: string
    customer: string
    status: number
    paymentMehod: string
    paymentIdendifier: string
    totalAmount: number
}

export type GetEcommerceDashboardResponse = {
    statisticData: StatisticData
    recentOrders: Order[]
    salesTarget: SalesTargetData
    topProduct: Product[]
    customerDemographic: CustomerDemographicData[]
    revenueByChannel: ChannelRevenue
}
