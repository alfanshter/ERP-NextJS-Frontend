import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import EmployeeListProvider from './_components/EmployeeListProvider'
import EmployeeListTable from './_components/EmployeeListTable'
import EmployeeListActionTools from './_components/EmployeeListActionTools'
import EmployeesListTableTools from './_components/EmployeesListTableTools'
import EmployeeListSelected from './_components/EmployeeListSelected'
import { getEmployeeList } from '@/server/actions/getEmployeeList'
import type { PageProps } from '@/@types/common'

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams
    const data = await getEmployeeList({
        page: parseInt(params.pageIndex as string) || 1,
        limit: parseInt(params.pageSize as string) || 10,
        search: params.query as string,
    })

    return (
        <EmployeeListProvider employeeList={data.data}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Employees</h3>
                            <EmployeeListActionTools />
                        </div>
                        <EmployeesListTableTools />
                        <EmployeeListTable
                            employeeListTotal={data.meta.total}
                            pageIndex={
                                parseInt(params.pageIndex as string) || 1
                            }
                            pageSize={parseInt(params.pageSize as string) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <EmployeeListSelected />
        </EmployeeListProvider>
    )
}
