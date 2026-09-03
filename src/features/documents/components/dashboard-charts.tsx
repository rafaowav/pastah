'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const statusLabels: Record<string, string> = {
  draft: 'Rascunho',
  sent: 'Enviado',
  accepted: 'Aceito',
  rejected: 'Rejeitado',
  archived: 'Arquivado',
  final: 'Finalizado',
}

const statusColors: Record<string, string> = {
  draft: '#94a3b8',
  sent: '#3b82f6',
  accepted: '#10b981',
  rejected: '#ef4444',
  archived: '#6b7280',
  final: '#8b5cf6',
}

const typeLabels: Record<string, string> = {
  orcamento: 'Orçamentos',
  proposta: 'Propostas',
  recibo: 'Recibos',
  'ordem-servico': 'Ordens de Serviço',
  contrato: 'Contratos',
}

const typeColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

interface MonthlyRevenueChartProps {
  data: { month: string; receita?: number; realizado: number; orcado?: number }[]
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`
            }
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: 12,
            }}
            formatter={(value: any, name: any) => [
              `R$ ${(Number(value) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              name === 'orcado' || name === 'receita' ? 'Faturamento Estimado' : 'Faturamento Realizado',
            ]}
          />
          <Bar
            dataKey="orcado"
            name="orcado"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="realizado"
            name="realizado"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface TypeDistributionChartProps {
  data: { type: string; count: number }[]
}

export function TypeDistributionChart({ data }: TypeDistributionChartProps) {
  const total = data.reduce((acc, d) => acc + d.count, 0)

  return (
    <div className="h-64">
      {total === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-slate-400">
          Nenhum documento criado ainda
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="count"
              nameKey="type"
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.type}
                  fill={typeColors[index % typeColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                fontSize: 12,
              }}
              formatter={(value: any, name: any) => [
                `${value} docs`,
                typeLabels[name] || name,
              ]}
            />
            <Legend
              formatter={(value) => typeLabels[value] || value}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || '#94a3b8'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: `${color}15`,
        color,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {statusLabels[status] || status}
    </span>
  )
}