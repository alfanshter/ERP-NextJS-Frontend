'use server'

import { apiGetEmployeeById } from '@/services/EmployeeService'
import type { Employee } from '@/app/(protected-pages)/employees/types'

export default async function getEmployee(params: { id: string }) {
    try {
        const response = await apiGetEmployeeById<Employee>(params.id)
        return response
    } catch (error) {
        console.error('Error fetching employee:', error)
        return null
    }
}
