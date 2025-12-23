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
import { useCustomerListStore } from '../_store/customerListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiDeleteStaff } from '@/services/CustomersService'
import { TbTrash, TbEye } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Staff } from '../types'

type CustomerListTableProps = {
    customerListTotal: number
    pageIndex?: number
    pageSize?: number
}

const statusColor: Record<string, string> = {
    true: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    false: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Staff }) => {
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
                href={`/users/details/${row.id}`}
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

const CustomerListTable = ({
    customerListTotal,
    pageIndex = 1,
    pageSize = 10,
}: CustomerListTableProps) => {
    const router = useRouter()

    const customerList = useCustomerListStore((state) => state.customerList)
    const selectedCustomer = useCustomerListStore(
        (state) => state.selectedCustomer,
    )
    const isInitialLoading = useCustomerListStore(
        (state) => state.initialLoading,
    )
    const setSelectedCustomer = useCustomerListStore(
        (state) => state.setSelectedCustomer,
    )
    const setSelectAllCustomer = useCustomerListStore(
        (state) => state.setSelectAllCustomer,
    )

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleDelete = (customer: Staff) => {
        setSelectedStaffId(customer.id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedStaffId) return

        try {
            setIsDeleting(true)
            await apiDeleteStaff(selectedStaffId)

            toast.push(
                <Notification title="Success" type="success">
                    Staff deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            setDeleteDialogOpen(false)
            setSelectedStaffId(null)
            setIsDeleting(false)
            router.refresh()
        } catch (error) {
            console.error('Error deleting staff:', error)
            setIsDeleting(false)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to delete staff. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
        setSelectedStaffId(null)
    }

    const handleViewDetails = (customer: Staff) => {
        router.push(`/users/details/${customer.id}`)
    }

    const columns: ColumnDef<Staff>[] = useMemo(
        () => [
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
                header: 'Role',
                accessorKey: 'role.name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold">{row.role.name}</span>
                            {row.role.description && (
                                <span className="text-xs text-gray-500">
                                    {row.role.description}
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={statusColor[String(row.isActive)]}>
                                <span className="capitalize">
                                    {row.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: (props) => {
                    return (
                        <span>
                            {dayjs(props.row.original.createdAt).format(
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

    const handleRowSelect = (checked: boolean, row: Staff) => {
        setSelectedCustomer(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Staff>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllCustomer(originalRows)
        } else {
            setSelectAllCustomer([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={customerList}
                noData={customerList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isInitialLoading}
                pagingData={{
                    total: customerListTotal,
                    pageIndex,
                    pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedCustomer.some((selected) => selected.id === row.id)
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
                <h5 className="mb-4">Delete Staff</h5>
                <p className="mb-6">
                    Are you sure you want to delete this staff member? This action cannot be undone.
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

export default CustomerListTable
