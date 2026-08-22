import { SidebarProvider } from '@/components/layout/sidebar'
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Header user={user} />
        <main className="flex-1 p-6 pt-16">{children}</main>
      </div>
    </SidebarProvider>
  )
}