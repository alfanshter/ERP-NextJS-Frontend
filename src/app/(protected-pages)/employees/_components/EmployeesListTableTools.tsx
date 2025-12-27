'use client'

import EmployeeListSearch from './EmployeeListSearch'
import EmployeeTableFilter from './EmployeeListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const EmployeesListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            query,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <EmployeeListSearch onInputChange={handleInputChange} />
            <EmployeeTableFilter />
        </div>
    )
}

export default EmployeesListTableTools
