'use client'

import { getCurrentUser } from '@/lib/auth/helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Building2, Package } from 'lucide-react'

export default function DashboardPage() {
  const user = await getCurrentUser()

  const stats = [
    {
      title: 'Documents',
      value: '0',
      description: 'Total documents created',
      icon: FileText,
    },
    {
      title: 'Clients',
      value: '0',
      description: 'Active clients',
      icon: Users,
    },
    {
      title: 'Companies',
      value: '0',
      description: 'Registered companies',
      icon: Building2,
    },
    {
      title: 'Products',
      value: '0',
      description: 'Products in catalog',
      icon: Package,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Manage your documents, clients, and more.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Get started with Pastah by creating your first document.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Add a Company</p>
                <p className="text-sm text-muted-foreground">
                  Register your company or business information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Add Clients</p>
                <p className="text-sm text-muted-foreground">
                  Add your clients to create documents for them
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Create Documents</p>
                <p className="text-sm text-muted-foreground">
                  Generate quotes, proposals, invoices, and more
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}