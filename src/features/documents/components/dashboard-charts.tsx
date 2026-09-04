'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import {
  operationalStatusLabel,
  operationalStatusBadgeClass,
  paymentStatusLabel,
  paymentStatusBadgeClass,
} from '@/lib/document-status'

const typeLabels: Record<string, string> = {
  orcamento: 'Orçamentos',
  proposta: 'Propostas',
  recibo: 'Recibos',
  'ordem-servico': 'Ordens de Serviço',
  contrato: 'Contratos',
}

const typeColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

function useChartTheme() {
  const isDark =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  return {
    tickFill: isDark ? '#94a3b8' : '#64748b',
    tooltipStyle: {
      borderRadius: 12,
      border: isDark ? '1px solid rgba(255,255,255,0.16)' : '1px solid #e2e8f0',
      backgroundColor: isDark ? '#1a2033' : '#ffffff',
      color: isDark ? '#f4f6fb' : '#0f172a',
      fontSize: 12,
    } as React.CSSProperties,
  }
}

interface MonthlyRevenueChartProps {
  data: { month: string; orcadoCents: number; recebidoCents: number; pendenteCents: number }[]
}

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  const theme = useChartTheme()
  const chartData = data.map((d) => ({
    ...d,
    orcado: d.orcadoCents / 100,
    recebido: d.recebidoCents / 100,
    pendente: d.pendenteCents / 100,
  }))

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={4}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: theme.tickFill }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.tickFill }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => (v >= 1000 ? `R$${(v / 1000).toFixed(0)}k` : `R$${v}`)}
          />
          <Tooltip
            contentStyle={theme.tooltipStyle}
            cursor={{ fill: 'rgba(148,163,184,0.08)' }}
            formatter={(value: any, name: any) => [
              `R$ ${(Number(value) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
              name === 'orcado'
                ? 'Estimado'
                : name === 'recebido'
                  ? 'Recebido'
                  : 'Pendente',
            ]}
          />
          <Bar dataKey="orcado" name="orcado" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="recebido" name="recebido" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="pendente" name="pendente" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface TypeDistributionChartProps {
  data: { type: string; count: number }[]
}

export function TypeDistributionChart({ data }: TypeDistributionChartProps) {
  const theme = useChartTheme()
  const total = data.reduce((acc, d) => acc + d.count, 0)

  return (
    <div className="h-64">
      {total === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
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
                <Cell key={entry.type} fill={typeColors[index % typeColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={theme.tooltipStyle}
              formatter={(value: any, name: any) => [`${value} docs`, typeLabels[name] || name]}
            />
            <Legend
              formatter={(value) => typeLabels[value] || value}
              wrapperStyle={{ fontSize: 11, color: theme.tickFill }}
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
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${operationalStatusBadgeClass(status)}`}
    >
      {operationalStatusLabel(status)}
    </span>
  )
}

interface PaymentStatusBadgeProps {
  status: string
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${paymentStatusBadgeClass(status)}`}
    >
      {paymentStatusLabel(status)}
    </span>
  )
}
