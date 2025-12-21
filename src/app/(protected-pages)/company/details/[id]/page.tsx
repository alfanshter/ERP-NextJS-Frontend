import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function CompanyDetailsPage({ params }: PageProps) {
    const { id } = await params

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <h3>Company Details - {id}</h3>
                    <p>Company details will be displayed here.</p>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
