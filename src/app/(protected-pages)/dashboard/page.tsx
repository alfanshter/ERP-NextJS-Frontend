import SuperadminStats from './_components/SuperadminStats'
import SuperadminRevenue from './_components/SuperadminRevenue'
import RecentCompanies from './_components/RecentCompanies'
import { getSuperadminDashboard } from '@/server/actions/getSuperadminDashboard'

export default async function Page() {
    const data = await getSuperadminDashboard()
    
    if (!data) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500">Failed to load dashboard data</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
                <SuperadminStats stats={data.stats} />
                <SuperadminRevenue revenue={data.revenue} />
                <RecentCompanies data={data.recentCompanies} />
            </div>
        </div>
    )
}
