'use client'

import CompanyListSearch from './CompanyListSearch'
import CompanyTableFilter from './CompanyListTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'

const CompaniesListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query: string) => {
        onAppendQueryParams({
            query,
        })
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <CompanyListSearch onInputChange={handleInputChange} />
            <CompanyTableFilter />
        </div>
    )
}

export default CompaniesListTableTools
