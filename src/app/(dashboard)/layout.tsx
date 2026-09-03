import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { getCurrentUser } from '@/lib/auth/helpers'
import { getCompaniesAction } from '@/features/companies/actions'
import { getActiveCompanyIdFromCookie } from '@/features/companies/active-company'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const [companiesRes] = await Promise.all([getCompaniesAction()])
  const companies = companiesRes.success ? companiesRes.data : []

  const safeUser = {
    name: user.name ?? user.email ?? 'Usuário',
    email: user.email ?? '',
  }

  // Resolve active company from cookie, falling back to first company
  const cookieCompanyId = await getActiveCompanyIdFromCookie()
  const activeCompany =
    companies.find((c) => c.id === cookieCompanyId) || companies[0] || null

  return (
    <div className="flex h-screen w-full bg-muted/50 overflow-hidden">
      {/* Fixed Left Navigation Rail */}
      <Sidebar />

      {/* Main Workspace Canvas Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          user={safeUser}
          companies={companies}
          activeCompany={activeCompany}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
          <div className="max-w-[1400px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}