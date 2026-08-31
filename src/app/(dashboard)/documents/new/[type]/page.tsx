import { getDocument } from '@/lib/document-engine/registry'
import { getClientsAction } from '@/features/clients/actions'
import { getCompaniesAction } from '@/features/companies/actions'
import { getProductsAction } from '@/features/products/actions'
import { DocumentForm } from '@/features/documents/components/document-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function NewDocumentByTypePage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params

  let docConfig
  try {
    docConfig = getDocument(type)
  } catch {
    notFound()
  }

  const [clientsResult, companiesResult, productsResult] = await Promise.all([
    getClientsAction(),
    getCompaniesAction(),
    getProductsAction(),
  ])

  const clients = clientsResult.success ? clientsResult.data : []
  const companies = companiesResult.success ? companiesResult.data : []
  const products = productsResult.success ? productsResult.data : []

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/documents/new">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Novo Documento</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Criar {docConfig.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{docConfig.description}</p>
        </div>
      </div>

      <DocumentForm
        mode="create"
        type={type}
        clients={clients}
        companies={companies}
        products={products}
      />
    </div>
  )
}
