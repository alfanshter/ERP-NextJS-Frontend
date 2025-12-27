import EmployeeEdit from './_components/EmployeeEdit'
import NoUserFound from '@/assets/svg/NoUserFound'
import getEmployee from '@/server/actions/getEmployee'
import isEmpty from 'lodash/isEmpty'

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params

    const data = await getEmployee(params)

    if (isEmpty(data)) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <NoUserFound height={280} width={280} />
                <h2 className="mt-4">No employee found!</h2>
            </div>
        )
    }

    return <EmployeeEdit data={data} />
}
