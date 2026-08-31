import Link from 'next/link'
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  CheckCircle2,
  Share2,
  Download,
  Star,
  Users,
  Building2,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <span className="font-bold text-lg tracking-tighter">P</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
              Pastah<span className="text-blue-600">.</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Recursos
            </a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">
              Templates
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              Como Funciona
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium text-slate-700 hover:text-slate-900">
                Entrar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-5 shadow-sm">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Workspace Editorial para Documentos
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
              Crie documentos comerciais com padrão{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                editorial de excelência.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Orçamentos, propostas, contratos e faturas estruturados com perfeição, geração instantânea de PDF e
              gestão completa de clientes e produtos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-slate-900/10 gap-2">
                  Criar Documento Agora <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-base font-medium border-slate-300 hover:bg-slate-100">
                  Ver Demonstração
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sem necessidade de cartão
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Exportação em PDF de alta resolução
              </span>
            </div>
          </div>

          {/* Stitch UI Preview Showcase */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-4 sm:p-6 main-container-shadow border border-slate-200/80">
              {/* Mockup Header Rail */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                    <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                  </div>
                  <span className="text-xs font-medium text-slate-400">Pastah Document Workspace — Orçamento #2026-08</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    Aprovado
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    PDF Pronto
                  </span>
                </div>
              </div>

              {/* Mockup Inner Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Mini Document */}
                <div className="md:col-span-8 bg-slate-50/70 rounded-2xl p-6 border border-slate-100 space-y-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-bold text-xl text-slate-900">Proposta de Consultoria Tecnológica</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Cliente: Apex Digital Corp • Emissor: Pastah Studio</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400 uppercase">Valor Total</p>
                      <p className="text-2xl font-bold font-heading text-slate-900">R$ 18.500,00</p>
                    </div>
                  </div>

                  {/* Items list simulation */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 text-sm">
                      <span className="font-medium text-slate-800">Design System & Frontend Architecture</span>
                      <span className="font-semibold text-slate-900">R$ 12.000,00</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 text-sm">
                      <span className="font-medium text-slate-800">Automação de Pipelines & Deploy</span>
                      <span className="font-semibold text-slate-900">R$ 6.500,00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-200/60">
                    <span>Validade: 15 dias</span>
                    <span>Condição: 50% entrada + 50% na entrega</span>
                  </div>
                </div>

                {/* Right Analytics Card */}
                <div className="md:col-span-4 bg-white rounded-2xl p-5 border border-slate-100 card-shadow space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Score de Qualidade</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">98/100</span>
                  </div>

                  {/* Radar Metric Mini SVG */}
                  <div className="w-full h-36 flex items-center justify-center radar-glow relative">
                    <svg viewBox="0 0 100 100" className="w-28 h-28 text-slate-200">
                      <polygon points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25" fill="none" stroke="currentColor" strokeWidth="1" />
                      <polygon points="50 20, 76 35, 76 65, 50 80, 24 65, 24 35" fill="none" stroke="currentColor" strokeWidth="1" />
                      <polygon points="50 15, 82 32, 70 70, 50 85, 25 60, 35 30" fill="#3980f4" fillOpacity="0.25" stroke="#3980f4" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between"><span>Clareza Editorial</span><span className="font-semibold text-slate-900">Excelente</span></div>
                    <div className="flex justify-between"><span>Tempo de Leitura</span><span className="font-semibold text-slate-900">2 min</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900">
              Construído para profissionais exigentes
            </h2>
            <p className="text-slate-600">
              Cada detalhe foi pensado para elevar a apresentação visual do seu negócio enquanto economiza seu tempo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-100 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Motor de Documentos Ágil</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Crie orçamentos detalhados, faturas comerciais, propostas de projetos e recibos em segundos com cálculo automático de subtotais.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-100 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Exportação em PDF Impecável</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gere arquivos PDF diagramados e prontos para impressão ou envio por e-mail com tipografia nítida e layout profissional.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/70 border border-slate-100 card-shadow-hover space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-slate-900">Catálogo & Clientes Integrados</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Armazene clientes, empresas e lista de produtos/serviços para preencher propostas em poucos cliques sem retrabalho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 bg-[#f8f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Galeria de Modelos</span>
              <h2 className="font-heading text-3xl font-bold text-slate-900 mt-1">Templates prontos para usar</h2>
            </div>
            <Link href="/templates">
              <Button variant="outline" className="mt-4 md:mt-0 rounded-full border-slate-300">
                Ver todos os templates <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Orçamento Comercial Executivo',
                type: 'Quote',
                desc: 'Layout equilibrado com discriminação de itens, prazos e condições financeiras.',
                tag: 'Mais Usado',
              },
              {
                title: 'Proposta de Prestação de Serviços',
                type: 'Proposal',
                desc: 'Estrutura completa para agências, consultorias e freelancers.',
                tag: 'Editorial',
              },
              {
                title: 'Fatura / Recibo Simplificado',
                type: 'Invoice',
                desc: 'Modelo conciso com dados de pagamento e comprovante fiscal.',
                tag: 'Essencial',
              },
            ].map((tmpl, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 card-shadow-hover flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {tmpl.type}
                    </span>
                    <span className="text-xs font-semibold text-blue-600">{tmpl.tag}</span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">{tmpl.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{tmpl.desc}</p>
                </div>
                <Link href="/register">
                  <Button variant="secondary" size="sm" className="w-full rounded-xl font-medium">
                    Usar este Modelo
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Pronto para transformar a apresentação dos seus documentos?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Junte-se aos profissionais que entregam orçamentos e propostas com visual memorável.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 py-6 text-base font-semibold shadow-xl">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-slate-950 text-slate-500 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-sm text-slate-300">Pastah.</span>
            <span>© {new Date().getFullYear()} Pastah Workspace. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-slate-300">Login</Link>
            <Link href="/register" className="hover:text-slate-300">Cadastro</Link>
            <Link href="/documents" className="hover:text-slate-300">Documentos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}