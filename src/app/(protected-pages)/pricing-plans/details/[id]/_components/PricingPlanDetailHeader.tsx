'use client'

import Button from '@/components/ui/Button'
import Link from 'next/link'
import { TbArrowLeft, TbEdit } from 'react-icons/tb'

type PricingPlanDetailHeaderProps = {
    planId: string
}

export default function PricingPlanDetailHeader({ planId }: PricingPlanDetailHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h3>Pricing Plan Details</h3>
            <div className="flex gap-2">
                <Link href="/pricing-plans">
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<TbArrowLeft />}
                    >
                        Back
                    </Button>
                </Link>
                <Link href={`/pricing-plans/edit/${planId}`}>
                    <Button
                        size="sm"
                        variant="solid"
                        icon={<TbEdit />}
                    >
                        Edit
                    </Button>
                </Link>
            </div>
        </div>
    )
}
