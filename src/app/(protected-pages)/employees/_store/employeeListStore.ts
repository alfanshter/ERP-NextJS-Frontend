import { create } from 'zustand'
import type { Employee, EmployeeFilter } from '../types'

export const initialFilterData: EmployeeFilter = {
    role: '',
    status: '',
}

export type EmployeesListState = {
    initialLoading: boolean
    employeeList: Employee[]
    filterData: EmployeeFilter
    selectedEmployee: Partial<Employee>[]
}

type EmployeesListAction = {
    setEmployeeList: (employeeList: Employee[]) => void
    setFilterData: (payload: EmployeeFilter) => void
    setSelectedEmployee: (checked: boolean, employee: Employee) => void
    setSelectAllEmployee: (employee: Employee[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: EmployeesListState = {
    initialLoading: true,
    employeeList: [],
    filterData: initialFilterData,
    selectedEmployee: [],
}

export const useEmployeeListStore = create<
    EmployeesListState & EmployeesListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedEmployee: (checked, row) =>
        set((state) => {
            const prevData = state.selectedEmployee
            if (checked) {
                return { selectedEmployee: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevEmployee) => row.id === prevEmployee.id)
                ) {
                    return {
                        selectedEmployee: prevData.filter(
                            (prevEmployee) => prevEmployee.id !== row.id,
                        ),
                    }
                }
                return { selectedEmployee: prevData }
            }
        }),
    setSelectAllEmployee: (row) => set(() => ({ selectedEmployee: row })),
    setEmployeeList: (employeeList) => set(() => ({ employeeList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
