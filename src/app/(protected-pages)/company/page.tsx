import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import CompanyListProvider from './_components/CompanyListProvider'
import CompanyListTable from './_components/CompanyListTable'
import CompanyListActionTools from './_components/CompanyListActionTools'
import CompaniesListTableTools from './_components/CompaniesListTableTools'
import CompanyListSelected from './_components/CompanyListSelected'
import getCompanies from '@/server/actions/getCompanies'
import type { PageProps } from '@/@types/common'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const response = await getCompanies(params)

    return (
        <CompanyListProvider companyList={response.data}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Companies</h3>
                            <CompanyListActionTools />
                        </div>
                        <CompaniesListTableTools />
                        <CompanyListTable
                            companyListTotal={response.meta.total}
                            pageIndex={response.meta.page}
                            pageSize={response.meta.limit}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <CompanyListSelected />
        </CompanyListProvider>
    )
}
