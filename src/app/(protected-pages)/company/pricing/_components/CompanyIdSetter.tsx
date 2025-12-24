'use client'

import { useEffect } from 'react'
import { usePricingStore } from '../_store/pricingStore'

type CompanyIdSetterProps = {
    companyId: string | null
}

const CompanyIdSetter = ({ companyId }: CompanyIdSetterProps) => {
    const { setCompanyId } = usePricingStore()

    useEffect(() => {
        setCompanyId(companyId)
    }, [companyId, setCompanyId])

    return null
}

export default CompanyIdSetter
