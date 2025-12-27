'use client'

import { useEffect } from 'react'
import { useEmployeeListStore } from '../_store/employeeListStore'
import type { Employee } from '../types'
import type { CommonProps } from '@/@types/common'

interface EmployeeListProviderProps extends CommonProps {
    employeeList: Employee[]
}

const EmployeeListProvider = ({
    employeeList,
    children,
}: EmployeeListProviderProps) => {
    const setEmployeeList = useEmployeeListStore(
        (state) => state.setEmployeeList,
    )

    const setInitialLoading = useEmployeeListStore(
        (state) => state.setInitialLoading,
    )

    useEffect(() => {
        setEmployeeList(employeeList)

        setInitialLoading(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeList])

    return <>{children}</>
}

export default EmployeeListProvider
