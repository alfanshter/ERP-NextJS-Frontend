import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function EditCompanyPage({ params }: PageProps) {
    const { id } = await params

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <h3>Edit Company - {id}</h3>
                    <p>Company edit form will be implemented here.</p>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
