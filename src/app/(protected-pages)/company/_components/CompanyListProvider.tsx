'use client'

import { useEffect } from 'react'
import { useCompanyListStore } from '../_store/companyListStore'
import type { Company } from '../types'
import type { CommonProps } from '@/@types/common'

interface CompanyListProviderProps extends CommonProps {
    companyList: Company[]
}

const CompanyListProvider = ({
    companyList,
    children,
}: CompanyListProviderProps) => {
    const setCompanyList = useCompanyListStore(
        (state) => state.setCompanyList,
    )

    const setInitialLoading = useCompanyListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setCompanyList(companyList)

        setInitialLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyList])

    return <>{children}</>
}

export default CompanyListProvider
