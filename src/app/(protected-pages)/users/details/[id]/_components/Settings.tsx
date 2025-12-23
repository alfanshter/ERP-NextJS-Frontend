'use client'

import { lazy, Suspense, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SettingsMenu from './SettingsMenu'
import SettingMobileMenu from './SettingMobileMenu'
import Loading from '@/components/shared/Loading'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useSettingsStore } from '../_store/settingsStore'
import { apiDeleteStaff } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'

const Profile = lazy(() => import('./SettingsProfile'))
const Security = lazy(() => import('./SettingsSecurity'))

const Settings = () => {
    const { currentView } = useSettingsStore()
    const params = useParams()
    const router = useRouter()
    const staffId = params?.id as string
    
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true)
            await apiDeleteStaff(staffId)
            
            toast.push(
                <Notification title="Success" type="success">
                    Staff deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )
            
            // Redirect ke list users
            router.push('/users')
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
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3>Staff Details</h3>
                <Button
                    variant="solid"
                    size="sm"
                    icon={<TbTrash />}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-red-600 hover:border-red-700"
                    onClick={handleDeleteClick}
                >
                    Delete Staff
                </Button>
            </div>
            
            <AdaptiveCard className="h-full">
                <div className="flex flex-auto h-full">
                    <div className="w-[200px] xl:w-[280px] hidden lg:block">
                        <SettingsMenu />
                    </div>
                    <div className="xl:ltr:pl-6 xl:rtl:pr-6 flex-1 py-2">
                        <div className="mb-6 lg:hidden">
                            <SettingMobileMenu />
                        </div>
                        <Suspense
                            fallback={<Loading loading={true} className="w-full" />}
                        >
                            {currentView === 'profile' && <Profile />}
                            {currentView === 'security' && <Security />}
                        </Suspense>
                    </div>
                </div>
            </AdaptiveCard>

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

export default Settings
