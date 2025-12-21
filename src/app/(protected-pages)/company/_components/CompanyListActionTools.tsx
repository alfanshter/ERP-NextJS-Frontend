'use client'

import Button from '@/components/ui/Button'
import { TbCloudDownload, TbBuildingSkyscraper } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useCompanyListStore } from '../_store/companyListStore'
import dynamic from 'next/dynamic'

const CSVLink = dynamic(() => import('react-csv').then((mod) => mod.CSVLink), {
    ssr: false,
})

const CompanyListActionTools = () => {
    const router = useRouter()

    const companyList = useCompanyListStore((state) => state.companyList)

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <CSVLink
                className="w-full"
                filename="companyList.csv"
                data={companyList}
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
                icon={<TbBuildingSkyscraper className="text-xl" />}
                onClick={() =>
                    router.push('/company/create')
                }
            >
                Add new
            </Button>
        </div>
    )
}

export default CompanyListActionTools
