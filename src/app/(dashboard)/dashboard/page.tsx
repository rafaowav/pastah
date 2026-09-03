import { getCurrentUser } from '@/lib/auth/helpers'
import { getDashboardData } from '@/features/dashboard/queries'
import { DashboardClient } from '@/features/dashboard/components/dashboard-client'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const data = await getDashboardData()

  return <DashboardClient data={data} user={{ name: user?.name ?? null, email: user?.email ?? null }} />
}
