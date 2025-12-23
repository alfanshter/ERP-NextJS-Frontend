'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar/Avatar'
import Notification from '@/components/ui/Notification'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Badge from '@/components/ui/Badge'
import dayjs from 'dayjs'
import { HiPencil, HiOutlineTrash } from 'react-icons/hi'
import { TbBuilding, TbWorld } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { deleteCompany } from '@/services/CompanyService'
import type { CompanyDetail } from '../../../types'

type CompanyInfoFieldProps = {
    title?: string
    value?: string | null
}

type ProfileSectionProps = {
    data: CompanyDetail
}

const CompanyInfoField = ({ title, value }: CompanyInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold text-gray-600 dark:text-gray-400">{title}</span>
            <p className="heading-text font-bold mt-1">{value || '-'}</p>
        </div>
    )
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900'
        case 'TRIAL':
            return 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900'
        case 'INACTIVE':
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
        case 'SUSPENDED':
            return 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900'
        default:
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
    }
}

const ProfileSection = ({ data }: ProfileSectionProps) => {
    const router = useRouter()

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleDialogOpen = () => {
        setDialogOpen(true)
    }

    const handleDelete = async () => {
        setDialogOpen(false)

        try {
            const response = await deleteCompany(data.id)

            if (response.success) {
                toast.push(
                    <Notification title={'Successfully Deleted'} type="success">
                        Company successfully deleted
                    </Notification>,
                    { placement: 'top-center' },
                )
                router.push('/company')
            } else {
                throw new Error(response.message || 'Failed to delete company')
            }
        } catch (err) {
            console.error('Error deleting company:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete company'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const handleEdit = () => {
        router.push(`/company/edit/${data.id}`)
    }

    return (
        <>
            <Card className="w-full">
                <div className="flex justify-end gap-2">
                    <Tooltip title="Edit company">
                        <button
                            className="close-button button-press-feedback"
                            type="button"
                            onClick={handleEdit}
                        >
                            <HiPencil />
                        </button>
                    </Tooltip>
                    <Tooltip title="Delete company">
                        <button
                            className="close-button button-press-feedback"
                            type="button"
                            onClick={handleDialogOpen}
                        >
                            <HiOutlineTrash />
                        </button>
                    </Tooltip>
                </div>
                <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                    <div className="flex xl:flex-col items-center gap-4 mt-6">
                        {data.logo ? (
                            <Avatar size={90} shape="circle" src={data.logo} />
                        ) : (
                            <Avatar
                                size={90}
                                shape="circle"
                                icon={<TbBuilding className="text-4xl" />}
                                className="bg-gray-200 dark:bg-gray-700"
                            />
                        )}
                        <div className="text-center">
                            <h4 className="font-bold">{data.name}</h4>
                            <Badge className={`${getStatusColor(data.status)} mt-2`}>
                                {data.status}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
                        <CompanyInfoField title="Email" value={data.email} />
                        <CompanyInfoField title="Phone" value={data.phone} />
                        <CompanyInfoField title="Address" value={data.address} />
                        {data.website && (
                            <div>
                                <span className="font-semibold text-gray-600 dark:text-gray-400">Website</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <TbWorld className="text-xl" />
                                    <a
                                        href={data.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-bold"
                                    >
                                        {data.website}
                                    </a>
                                </div>
                            </div>
                        )}
                        <CompanyInfoField
                            title="Created Date"
                            value={dayjs(data.createdAt).format('DD MMM YYYY')}
                        />
                        <CompanyInfoField
                            title="Last Updated"
                            value={dayjs(data.updatedAt).format('DD MMM YYYY')}
                        />
                    </div>
                </div>
                <div className="mt-8 flex gap-2">
                    <Button
                        variant="solid"
                        className="w-full"
                        onClick={handleEdit}
                    >
                        Edit Company
                    </Button>
                </div>
            </Card>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete company"
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                onCancel={handleDialogClose}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to delete this company? All data
                    associated with this company will be permanently removed.
                    This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProfileSection
