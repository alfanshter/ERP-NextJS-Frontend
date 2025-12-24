import Card from '@/components/ui/Card'
import Plans from './_components/Plans'
import PaymentCycleToggle from './_components/PaymentCycleToggle'
import Faq from './_components/Faq'
import PaymentDialog from './_components/PaymentDialog'
import { getPricingPlans } from '@/server/actions/getPricingPlans'
import type { PageProps } from '@/@types/common'
import type { GetPricingPanResponse } from './types'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const backendPlans = await getPricingPlans()

    // Transform backend data to template format
    const data: GetPricingPanResponse = {
        featuresModel: [],
        plans: backendPlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description || '',
            price: {
                monthly: plan.finalMonthlyPrice,
                annually: plan.finalYearlyPrice,
            },
            originalPrice: {
                monthly: plan.monthlyPrice,
                annually: plan.yearlyPrice,
            },
            discount: {
                monthly: plan.monthlyDiscount,
                annually: plan.yearlyDiscount,
            },
            discountType: plan.discountType,
            features: plan.features || [],
            recommended: plan.name.toLowerCase().includes('professional') || plan.name.toLowerCase().includes('pro'),
            maxUsers: plan.maxUsers,
            maxProjects: plan.maxProjects,
            maxStorage: plan.maxStorage,
        })),
    }

    return (
        <>
            <Card className="mb-4">
                <div className="flex items-center justify-between mb-8">
                    <h3>Pricing</h3>
                    <PaymentCycleToggle />
                </div>
                <Plans
                    data={data}
                    subcription={params.subcription as string}
                    cycle={params.cycle as string}
                />
            </Card>
            <Faq />
            <PaymentDialog />
        </>
    )
}
