'use client'

import Button from '@/components/ui/Button'
import Link from 'next/link'
import { TbPlus } from 'react-icons/tb'

const PricingPlansHeader = () => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3>Pricing Plans</h3>
            <Link href="/pricing-plans/create">
                <Button
                    variant="solid"
                    icon={<TbPlus className="text-xl" />}
                >
                    Add New Plan
                </Button>
            </Link>
        </div>
    )
}

export default PricingPlansHeader
