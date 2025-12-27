'use client'

import Button from '@/components/ui/Button'
import { TbCloudDownload, TbUserPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useEmployeeListStore } from '../_store/employeeListStore'
import dynamic from 'next/dynamic'

const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), {
    ssr: false,
})

const EmployeeListActionTools = () => {
    const router = useRouter()

    const employeeList = useEmployeeListStore((state) => state.employeeList)

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="employeeList.csv"
                data={employeeList}
            >
                <Button
                    icon={<TbCloudDownload className="text-xl" />}
                    className="w-full"
                >
                    Download
                </Button>
            </CSVLink>
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() =>
                    router.push('/employees/create')
                }
            >
                Add new
            </Button>
        </div>
    )
}

export default EmployeeListActionTools
