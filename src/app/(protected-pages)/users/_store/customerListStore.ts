import { create } from 'zustand'
import type { Staff, StaffFilter } from '../types'

export const initialFilterData: StaffFilter = {
    role: '',
    status: '',
}

export type CustomersListState = {
    initialLoading: boolean
    customerList: Staff[]
    filterData: StaffFilter
    selectedCustomer: Partial<Staff>[]
}

type CustomersListAction = {
    setCustomerList: (customerList: Staff[]) => void
    setFilterData: (payload: StaffFilter) => void
    setSelectedCustomer: (checked: boolean, customer: Staff) => void
    setSelectAllCustomer: (customer: Staff[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: CustomersListState = {
    initialLoading: true,
    customerList: [],
    filterData: initialFilterData,
    selectedCustomer: [],
}

export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedCustomer: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCustomer
            if (checked) {
                return { selectedCustomer: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCustomer) => row.id === prevCustomer.id)
                ) {
                    return {
                        selectedCustomer: prevData.filter(
                            (prevCustomer) => prevCustomer.id !== row.id,
                        ),
                    }
                }
                return { selectedCustomer: prevData }
            }
        }),
    setSelectAllCustomer: (row) => set(() => ({ selectedCustomer: row })),
    setCustomerList: (customerList) => set(() => ({ customerList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
