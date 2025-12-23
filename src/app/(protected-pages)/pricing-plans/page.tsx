import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import PricingPlansHeader from './_components/PricingPlansHeader'
import PricingPlansTable from './_components/PricingPlansTable'
import { getPricingPlans } from '@/server/actions/getPricingPlans'

export default async function Page() {
    const data = await getPricingPlans({ includeInactive: true })
    
    console.log('Pricing Plans Data:', data)

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <PricingPlansHeader />
                    <PricingPlansTable plans={data || []} />
                </div>
            </AdaptiveCard>
        </Container>
    )
}
