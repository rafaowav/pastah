import { getCompanyByIdAction } from '@/features/companies/actions'
import { notFound } from 'next/navigation'
import { CompanyForm } from '@/features/companies/components/company-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCompanyByIdAction(id)
  
  if (!result.success) {
    notFound()
  }
  
  const company = result.data
  const formData = {
    ...company,
    email: company.email ?? undefined,
    document: company.document ?? undefined,
    phone: company.phone ?? undefined,
    address: company.address ?? undefined,
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/companies">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Edição de Empresa</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Editar Empresa: {company.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Atualize as informações cadastrais da sua empresa emissora.
          </p>
        </div>
      </div>

      <CompanyForm mode="edit" initialData={formData} />
    </div>
  )
}