import { getCurrentUser } from '@/lib/auth/helpers'
import { getDocumentsAction } from '@/features/documents/actions'
import { getClientsAction } from '@/features/clients/actions'
import { getCompaniesAction } from '@/features/companies/actions'
import { getProductsAction } from '@/features/products/actions'
import Link from 'next/link'
import {
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Package,
  Layers,
  Sparkles,
  FileStack,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  // Parallel fetch dashboard data
  const [docsRes, clientsRes, companiesRes, productsRes] = await Promise.all([
    getDocumentsAction(),
    getClientsAction(),
    getCompaniesAction(),
    getProductsAction(),
  ])

  const documents = docsRes.success ? docsRes.data : []
  const clients = clientsRes.success ? clientsRes.data : []
  const companies = companiesRes.success ? companiesRes.data : []
  const products = productsRes.success ? productsRes.data : []

  const recentDocs = documents.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Aqui está a visão geral do seu workspace e fluxo de documentos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/templates">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 gap-1.5 h-10">
              <FileStack className="w-4 h-4" /> Templates
            </Button>
          </Link>
          <Link href="/documents/new">
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl gap-1.5 h-10 px-4 shadow-sm">
              <Plus className="w-4 h-4" /> Criar Documento
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid matching Stitch Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Span 8) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Document Overview KPI Card (Stitch Component) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Performance de Produção</span>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-0.5">Visão Geral dos Documentos</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                Trimestre Atual
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Stats Column */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                    Progresso Geral de Entregas{' '}
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      +12% vs mês anterior
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
                      {documents.length > 0 ? '84%' : '0%'}
                    </span>
                    <span className="text-sm font-medium text-slate-500">Concluídos e Enviados</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Tempo Médio de Elaboração</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">|</span>
                      <span className="font-bold text-slate-900">4.2 min</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Taxa de Aprovação de Orçamentos</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">|</span>
                      <span className="font-bold text-slate-900">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Revisões Médias por Proposta</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300">|</span>
                      <span className="font-bold text-slate-900">1.2</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 text-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-3 w-max border border-slate-100">
                  <div className="w-5 h-5 rounded-md bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800">88% da meta trimestral atingida</span>
                </div>
              </div>

              {/* Radar Chart Graphic (Stitch Component) */}
              <div className="md:col-span-5 relative flex items-center justify-center p-2">
                <div className="w-56 h-56 relative radar-glow flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200">
                    {/* Concentric Polygons */}
                    <polygon fill="none" points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" stroke="currentColor" strokeWidth="0.8" />
                    <polygon fill="none" points="50 20, 76 35, 76 65, 50 80, 24 65, 24 35" stroke="currentColor" strokeWidth="0.8" />
                    <polygon fill="none" points="50 35, 63 42.5, 63 57.5, 50 65, 37 57.5, 37 42.5" stroke="currentColor" strokeWidth="0.8" />

                    {/* Radial Axes */}
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="50" y2="5" />
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="90" y2="25" />
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="90" y2="75" />
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="50" y2="95" />
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="10" y2="75" />
                    <line stroke="currentColor" strokeWidth="0.8" x1="50" y1="50" x2="10" y2="25" />

                    {/* Active Polygon Data */}
                    <polygon
                      points="50 15, 82 32, 72 70, 50 85, 25 60, 36 30"
                      fill="url(#radarGradient)"
                      fillOpacity="0.75"
                      stroke="#3980f4"
                      strokeWidth="2"
                    />

                    <defs>
                      <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#3980f4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3980f4" stopOpacity="0.2" />
                      </radialGradient>
                    </defs>
                  </svg>

                  {/* Micro Labels */}
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500">Qualidade</span>
                  <span className="absolute top-1/4 -right-4 text-[10px] font-semibold text-slate-500">Velocidade</span>
                  <span className="absolute bottom-1/4 -right-4 text-[10px] font-semibold text-slate-500">Conformidade</span>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-500">Clareza</span>
                  <span className="absolute bottom-1/4 -left-4 text-[10px] font-semibold text-slate-500">Impacto</span>
                  <span className="absolute top-1/4 -left-4 text-[10px] font-semibold text-slate-500">Estrutura</span>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Documents Table (Stitch Component) */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atividades Recentes</span>
                <h2 className="font-heading text-xl font-bold text-slate-900 mt-0.5">Documentos Recentes</h2>
              </div>
              <Link href="/documents" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Ver todos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentDocs.length === 0 ? (
              <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-slate-800 text-base">Nenhum documento criado ainda</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Crie seu primeiro orçamento ou proposta em segundos usando nossos modelos.
                </p>
                <Link href="/documents/new" className="inline-block mt-4">
                  <Button size="sm" className="bg-slate-900 text-white rounded-xl text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Criar Documento
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 pb-3 text-[11px] font-bold uppercase text-slate-400 tracking-wider hidden sm:grid">
                  <div className="col-span-5">Documento</div>
                  <div className="col-span-2">Tipo</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3 text-right">Data</div>
                </div>

                {recentDocs.map((doc: any) => (
                  <Link
                    key={doc.id}
                    href={`/documents`}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 py-3.5 items-center hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors group"
                  >
                    <div className="col-span-12 sm:col-span-5 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {doc.client?.name ? `Cliente: ${doc.client.name}` : 'Sem cliente vinculado'}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium capitalize">
                        {doc.type}
                      </span>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        doc.status === 'published' || doc.status === 'final'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {doc.status === 'draft' ? 'Rascunho' : doc.status}
                      </span>
                    </div>

                    <div className="col-span-12 sm:col-span-3 text-left sm:text-right text-xs text-slate-400">
                      {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true, locale: ptBR })}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN (Span 4) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Metrics Grid */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-shadow space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <FileText className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold font-heading text-slate-900">{documents.length}</p>
              <p className="text-xs text-slate-500 font-medium">Documentos Criados</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-shadow space-y-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold font-heading text-slate-900">{clients.length}</p>
              <p className="text-xs text-slate-500 font-medium">Clientes Ativos</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-shadow space-y-1">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
                <Building2 className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold font-heading text-slate-900">{companies.length}</p>
              <p className="text-xs text-slate-500 font-medium">Empresas / Emissores</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 card-shadow space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                <Package className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold font-heading text-slate-900">{products.length}</p>
              <p className="text-xs text-slate-500 font-medium">Produtos / Serviços</p>
            </div>
          </section>

          {/* Quick Actions Shortcuts */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200/80 main-container-shadow space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">Ações Rápidas</h3>

            <div className="space-y-2">
              <Link href="/documents/new" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Novo Orçamento</p>
                    <p className="text-[11px] text-slate-500">Com cálculo automático</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link href="/clients/new" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Cadastrar Cliente</p>
                    <p className="text-[11px] text-slate-500">Dados para faturamento</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link href="/companies/new" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Configurar Empresa</p>
                    <p className="text-[11px] text-slate-500">Logotipo e dados fiscais</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link href="/products/new" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-sm">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Adicionar Item / Preço</p>
                    <p className="text-[11px] text-slate-500">Catálogo de itens rápidos</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </section>

          {/* Featured Templates Widget */}
          <section className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pastah Templates
              </span>
              <h4 className="font-heading font-bold text-lg">Precisa de Inspiração?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilize nossa galeria de modelos estruturados para propostas comerciais de alto impacto.
              </p>
            </div>
            <Link href="/templates" className="inline-block relative z-10 w-full">
              <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-semibold text-xs">
                Explorar Galeria
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}