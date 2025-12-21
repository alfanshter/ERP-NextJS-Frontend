'use client'

import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'
import ProfileSection from './ProfileSection'
import SubscriptionSection from './SubscriptionSection'
import UsersSection from './UsersSection'
import StatsSection from './StatsSection'
import type { CompanyDetail } from '../../../types'

type CompanyDetailsProps = {
    data: CompanyDetail
}

const { TabNav, TabList, TabContent } = Tabs

const CompanyDetails = ({ data }: CompanyDetailsProps) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Statistics Section */}
            <StatsSection data={data} />

            {/* Main Content */}
            <div className="flex flex-col xl:flex-row gap-4">
                {/* Profile Sidebar */}
                <div className="min-w-[330px] 2xl:min-w-[400px]">
                    <ProfileSection data={data} />
                </div>

                {/* Tabs Content */}
                <Card className="w-full">
                    <Tabs defaultValue="subscription">
                        <TabList>
                            <TabNav value="subscription">Subscription</TabNav>
                            <TabNav value="users">Users</TabNav>
                        </TabList>
                        <div className="p-4">
                            <TabContent value="subscription">
                                <SubscriptionSection data={data} />
                            </TabContent>
                            <TabContent value="users">
                                <UsersSection data={data} />
                            </TabContent>
                        </div>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}

export default CompanyDetails
