'use client'

import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import DataTable from '@/components/shared/DataTable'
import { useEmployeeListStore } from '../_store/employeeListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiDeleteEmployee } from '@/services/EmployeeService'
import { TbTrash, TbEye } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Employee } from '../types'

type EmployeeListTableProps = {
    employeeListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    ACTIVE: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    INACTIVE: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
    SUSPENDED: 'bg-yellow-200 dark:bg-yellow-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Employee }) => {
    const fullName = `${row.firstName} ${row.lastName}`
    const initials = `${row.firstName.charAt(0)}${row.lastName.charAt(0)}`
    
    return (
        <div className="flex items-center">
            <Avatar size={40} shape="circle" src={row.avatar || undefined}>
                {!row.avatar && (
                    <span className="font-semibold">{initials}</span>
                )}
            </Avatar>
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                href={`/employees/details/${row.id}`}
            >
                {fullName}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onDelete,
    onViewDetail,
}: {
    onDelete: () => void
    onViewDetail: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Delete">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold text-red-600 hover:text-red-700`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
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

const EmployeeListTable = ({
    employeeListTotal,
    pageIndex = 1,
    pageSize = 10,
}: EmployeeListTableProps) => {
    const router = useRouter()

    const employeeList = useEmployeeListStore((state) => state.employeeList)
    const selectedEmployee = useEmployeeListStore(
        (state) => state.selectedEmployee,
    )
    const isInitialLoading = useEmployeeListStore(
        (state) => state.initialLoading,
    )
    const setSelectedEmployee = useEmployeeListStore(
        (state) => state.setSelectedEmployee,
    )
    const setSelectAllEmployee = useEmployeeListStore(
        (state) => state.setSelectAllEmployee,
    )

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleDelete = (employee: Employee) => {
        setSelectedEmployeeId(employee.id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedEmployeeId) return

        try {
            setIsDeleting(true)
            await apiDeleteEmployee(selectedEmployeeId)

            toast.push(
                <Notification title="Success" type="success">
                    Employee deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            setDeleteDialogOpen(false)
            setSelectedEmployeeId(null)
            setIsDeleting(false)
            router.refresh()
        } catch (error) {
            console.error('Error deleting employee:', error)
            setIsDeleting(false)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to delete employee. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
        setSelectedEmployeeId(null)
    }

    const handleViewDetails = (employee: Employee) => {
        router.push(`/employees/details/${employee.id}`)
    }

    const columns: ColumnDef<Employee>[] = useMemo(
        () => [
            {
                header: 'Employee Code',
                accessorKey: 'employeeCode',
                cell: (props) => {
                    return <span className="font-semibold">{props.row.original.employeeCode}</span>
                },
            },
            {
                header: 'Name',
                accessorKey: 'firstName',
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
                cell: (props) => {
                    return <span>{props.row.original.phone || '-'}</span>
                },
            },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold">{row.position}</span>
                            <span className="text-xs text-gray-500">
                                {row.department}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[row.status] || statusColor.INACTIVE}>
                                <span className="capitalize">
                                    {row.status}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Join Date',
                accessorKey: 'joinDate',
                cell: (props) => {
                    return (
                        <span>
                            {dayjs(props.row.original.joinDate).format(
                                'MMM DD, YYYY',
                            )}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onDelete={() => handleDelete(props.row.original)}
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

    const handleRowSelect = (checked: boolean, row: Employee) => {
        setSelectedEmployee(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Employee>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllEmployee(originalRows)
        } else {
            setSelectAllEmployee([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={employeeList}
                noData={employeeList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isInitialLoading}
                pagingData={{
                    total: employeeListTotal,
                    pageIndex,
                    pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedEmployee.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
            >
                <h5 className="mb-4">Delete Employee</h5>
                <p className="mb-6">
                    Are you sure you want to delete this employee? This action cannot be undone.
                </p>
                <div className="text-right">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleCancelDelete}
                        disabled={isDeleting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleConfirmDelete}
                        loading={isDeleting}
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default EmployeeListTable
