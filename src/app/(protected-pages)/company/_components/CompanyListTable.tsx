'use client'

import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useCompanyListStore } from '../_store/companyListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Company } from '../types'

type CompanyListTableProps = {
    companyListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    TRIAL: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    ACTIVE: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    INACTIVE: 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900',
    SUSPENDED: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Company }) => {
    return (
        <div className="flex items-center">
            <Avatar size={40} shape="circle" src={row.logo || undefined} />
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                href={`/company/details/${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const CompanyListTable = ({
    companyListTotal,
    pageIndex = 1,
    pageSize = 10,
}: CompanyListTableProps) => {
    const router = useRouter()

    const companyList = useCompanyListStore((state) => state.companyList)
    const selectedCompany = useCompanyListStore(
        (state) => state.selectedCompany,
    )
    const isInitialLoading = useCompanyListStore(
        (state) => state.initialLoading,
    )
    const setSelectedCompany = useCompanyListStore(
        (state) => state.setSelectedCompany,
    )
    const setSelectAllCompany = useCompanyListStore(
        (state) => state.setSelectAllCompany,
    )

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleEdit = (company: Company) => {
        router.push(`/company/edit/${company.id}`)
    }

    const handleViewDetails = (company: Company) => {
        router.push(`/company/details/${company.id}`)
    }

    const columns: ColumnDef<Company>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status]}>
                                <span className="capitalize">{row.status}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Users',
                accessorKey: '_count.users',
                cell: (props) => {
                    return <span>{props.row.original._count.users}</span>
                },
            },
            {
                header: 'Projects',
                accessorKey: '_count.projects',
                cell: (props) => {
                    return <span>{props.row.original._count.projects}</span>
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    const handlePaginationChange = (page: number) => {
        onAppendQueryParams({
            pageIndex: String(page),
        })
    }

    const handleSelectChange = (value: number) => {
        onAppendQueryParams({
            pageSize: String(value),
            pageIndex: '1',
        })
    }

    const handleSort = (sort: OnSortParam) => {
        onAppendQueryParams({
            order: sort.order,
            sortKey: sort.key,
        })
    }

    const handleRowSelect = (checked: boolean, row: Company) => {
        setSelectedCompany(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Company>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCompany(originalRows)
        } else {
            setSelectAllCompany([])
        }
    }

    return (
        <DataTable
            selectable
            columns={columns}
            data={companyList}
            noData={companyList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isInitialLoading}
            pagingData={{
                total: companyListTotal,
                pageIndex,
                pageSize,
            }}
            checkboxChecked={(row) =>
                selectedCompany.some((selected) => selected.id === row.id)
            }
            onPaginationChange={handlePaginationChange}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
            onCheckBoxChange={handleRowSelect}
            onIndeterminateCheckBoxChange={handleAllRowSelect}
        />
    )
}

export default CompanyListTable
