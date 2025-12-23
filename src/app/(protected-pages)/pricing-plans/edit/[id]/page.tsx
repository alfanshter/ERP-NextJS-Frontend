import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import PricingPlanEditForm from './_components/PricingPlanEditForm'
import { apiGetPricingPlanById } from '@/services/PricingPlansService'
import { notFound } from 'next/navigation'
import type { PricingPlan } from '../../types'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let plan: PricingPlan

    try {
        plan = await apiGetPricingPlanById<PricingPlan>(id)
    } catch (error) {
        console.error('Error fetching pricing plan:', error)
        notFound()
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="max-w-3xl">
                    <div className="mb-6">
                        <h3>Edit Pricing Plan</h3>
                        <p className="text-gray-500 mt-1">Update pricing plan information</p>
                    </div>
                    <PricingPlanEditForm plan={plan} />
                </div>
            </AdaptiveCard>
        </Container>
    )
}
