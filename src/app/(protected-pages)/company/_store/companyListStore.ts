import { create } from 'zustand'
import type { Company, Filter } from '../types'

export const initialFilterData = {
    status: '',
    search: '',
}

export type CompaniesListState = {
    initialLoading: boolean
    companyList: Company[]
    filterData: Filter
    selectedCompany: Partial<Company>[]
}

type CompaniesListAction = {
    setCompanyList: (companyList: Company[]) => void
    setFilterData: (payload: Filter) => void
    setSelectedCompany: (checked: boolean, company: Company) => void
    setSelectAllCompany: (company: Company[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: CompaniesListState = {
    initialLoading: true,
    companyList: [],
    filterData: initialFilterData,
    selectedCompany: [],
}

export const useCompanyListStore = create<
    CompaniesListState & CompaniesListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setSelectedCompany: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCompany
            if (checked) {
                return { selectedCompany: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCompany) => row.id === prevCompany.id)
                ) {
                    return {
                        selectedCompany: prevData.filter(
                            (prevCompany) => prevCompany.id !== row.id,
                        ),
                    }
                }
                return { selectedCompany: prevData }
            }
        }),
    setSelectAllCompany: (row) => set(() => ({ selectedCompany: row })),
    setCompanyList: (companyList) => set(() => ({ companyList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
