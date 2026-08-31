import { TemplateForm } from '@/features/templates/components/template-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTemplatePage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/templates">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Novo Modelo</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Criar Template Personalizado
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure seu modelo para acelerar a emissão de orçamentos e propostas.
          </p>
        </div>
      </div>

      <TemplateForm mode="create" />
    </div>
  )
}
