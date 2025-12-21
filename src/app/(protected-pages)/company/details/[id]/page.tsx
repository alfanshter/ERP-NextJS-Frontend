import Container from '@/components/shared/Container'
import CompanyDetails from './_components/CompanyDetails'
import NoDataFound from '@/assets/svg/NoDataFound'
import getCompanyDetail from '@/server/actions/getCompanyDetail'
import isEmpty from 'lodash/isEmpty'
import type { CompanyDetail as CompanyDetailType } from '../../types'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function CompanyDetailsPage({ params }: PageProps) {
    const { id } = await params
    const data = await getCompanyDetail({ id })

    if (isEmpty(data)) {
        return (
            <Container>
                <div className="h-full flex flex-col items-center justify-center py-20">
                    <NoDataFound height={280} width={280} />
                    <h2 className="mt-4">Company not found!</h2>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <CompanyDetails data={data as CompanyDetailType} />
        </Container>
    )
}
