import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'
import { getCurrentUser } from '@/lib/auth/helpers'
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

  const safeUser = {
    name: user.name ?? user.email ?? 'Usuário',
    email: user.email ?? '',
  }

  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] overflow-hidden">
      {/* Fixed Left Navigation Rail */}
      <Sidebar />

      {/* Main Workspace Canvas Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header user={safeUser} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#f8f9fc]">
          <div className="max-w-[1400px] mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}