'use client'

import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import DataTable from '@/components/shared/DataTable'
import { useRouter } from 'next/navigation'
import { apiDeletePricingPlan } from '@/services/PricingPlansService'
import { TbTrash, TbEye, TbEdit } from 'react-icons/tb'
import type { ColumnDef } from '@/components/shared/DataTable'
import type { PricingPlan } from '../types'

type PricingPlansTableProps = {
    plans: PricingPlan[]
}

const statusColor: Record<string, string> = {
    true: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    false: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const billingPeriodColor: Record<string, string> = {
    MONTHLY: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    YEARLY: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    LIFETIME: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
}

const ActionColumn = ({
    onDelete,
    onEdit,
    onViewDetail,
}: {
    onDelete: () => void
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
                    <TbEdit />
                </div>
            </Tooltip>
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

const PricingPlansTable = ({ plans = [] }: PricingPlansTableProps) => {
    const router = useRouter()
    
    console.log('PricingPlansTable received plans:', plans)
    console.log('Plans length:', plans.length)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = (plan: PricingPlan) => {
        setSelectedPlanId(plan.id)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedPlanId) return

        try {
            setIsDeleting(true)
            await apiDeletePricingPlan(selectedPlanId)

            toast.push(
                <Notification title="Success" type="success">
                    Pricing plan deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            setDeleteDialogOpen(false)
            setSelectedPlanId(null)
            setIsDeleting(false)
            router.refresh()
        } catch (error) {
            console.error('Error deleting pricing plan:', error)
            setIsDeleting(false)
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to delete pricing plan. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
        setSelectedPlanId(null)
    }

    const handleEdit = (plan: PricingPlan) => {
        router.push(`/pricing-plans/edit/${plan.id}`)
    }

    const handleViewDetails = (plan: PricingPlan) => {
        router.push(`/pricing-plans/details/${plan.id}`)
    }

    const columns: ColumnDef<PricingPlan>[] = useMemo(
        () => [
            {
                header: 'Plan Name',
                accessorKey: 'name',
                cell: (props) => {
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold">{props.row.original.name}</span>
                            {props.row.original.description && (
                                <span className="text-xs text-gray-500">
                                    {props.row.original.description}
                                </span>
                            )}
                        </div>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    return (
                        <span className="font-semibold text-lg">
                            Rp {props.row.original.price.toLocaleString('id-ID')}
                        </span>
                    )
                },
            },
            {
                header: 'Billing Period',
                accessorKey: 'billingPeriod',
                cell: (props) => {
                    const period = props.row.original.billingPeriod
                    return (
                        <Tag className={billingPeriodColor[period]}>
                            <span className="capitalize">
                                {period.toLowerCase()}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Limits',
                accessorKey: 'maxUsers',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex flex-col text-sm">
                            <span>Users: {row.maxUsers || 'Unlimited'}</span>
                            <span>Projects: {row.maxProjects || 'Unlimited'}</span>
                            <span>Storage: {row.maxStorage ? `${row.maxStorage}GB` : 'Unlimited'}</span>
                        </div>
                    )
                },
            },
            {
                header: 'Features',
                accessorKey: 'features',
                cell: (props) => {
                    const features = props.row.original.features
                    return (
                        <div className="flex flex-col text-sm">
                            {features.slice(0, 2).map((feature, index) => (
                                <span key={index}>• {feature}</span>
                            ))}
                            {features.length > 2 && (
                                <span className="text-gray-500">
                                    +{features.length - 2} more
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
                        <Tag className={statusColor[String(row.isActive)]}>
                            <span className="capitalize">
                                {row.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onDelete={() => handleDelete(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                        onViewDetail={() => handleViewDetails(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    return (
        <>
            <DataTable
                columns={columns}
                data={plans}
            />

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
            >
                <h5 className="mb-4">Delete Pricing Plan</h5>
                <p className="mb-6">
                    Are you sure you want to delete this pricing plan? This action cannot be undone.
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

export default PricingPlansTable
