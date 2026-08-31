import { getAllDocuments } from '@/lib/document-engine/registry'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function NewDocumentPage() {
  const documentTypes = getAllDocuments()

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/documents">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white text-slate-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Criador de Documentos</span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-0.5">
            Selecione o Tipo de Documento
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Escolha o modelo estruturado para iniciar a diagramação.
          </p>
        </div>
      </div>

      {/* Grid of Document Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentTypes.map((doc) => {
          const Icon = doc.icon || FileText

          return (
            <Link key={doc.id} href={`/documents/new/${doc.id}`} className="group">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow card-shadow-hover h-full flex flex-col justify-between space-y-4">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-900 flex items-center justify-center transition-colors mb-4 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-blue-600">
                  <span>Criar {doc.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
