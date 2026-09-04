'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Wallet,
  Undo2,
  Loader2,
  FileText,
  ArrowRight,
  Plus,
  Receipt,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  DocumentRow,
} from '@/features/documents/data'
import { RelatedDocumentItem } from '@/features/documents/actions'
import {
  finalizeDocumentAction,
  markDocumentReceivedAction,
  registerPartialPaymentAction,
  undoDocumentPaymentAction,
} from '../actions'
import {
  operationalStatusLabel,
  operationalStatusBadgeClass,
  paymentStatusLabel,
  paymentStatusBadgeClass,
  documentTypeLabel,
  formatCentsBRL,
  formatBRL,
  DOCUMENT_RELATION_TYPE_LABELS,
} from '@/lib/document-status'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DocumentDetailClientProps {
  document: DocumentRow
  related: RelatedDocumentItem[]
}

export function DocumentDetailClient({ document: doc, related }: DocumentDetailClientProps) {
  const router = useRouter()
  const [docState, setDocState] = useState<DocumentRow>(doc)
  const [busy, setBusy] = useState<string | null>(null)
  const [partialOpen, setPartialOpen] = useState(false)

  const remainingCents = docState.totalAmount - docState.receivedAmount
  const fullyPaid = docState.paymentStatus === 'recebido'
  const isFinancial = docState.totalAmount > 0

  async function run(
    key: string,
    action: () => Promise<{ success: boolean; error?: string; data?: DocumentRow }>,
  ) {
    if (busy) return
    setBusy(key)
    try {
      const res = await action()
      if (res.success && res.data) {
        setDocState(res.data)
        router.refresh()
      } else if (!res.success) {
        toast.error(res.error || 'Ação não concluída.')
      }
      return res
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('[document-detail]', error)
      toast.error('Não foi possível concluir a ação.')
    } finally {
      setBusy(null)
    }
  }

  async function handleFinalize() {
    if (!confirm('Finalizar este documento? O status operacional mudará para Finalizado.')) return
    await run('finalize', async () => {
      const res = await finalizeDocumentAction(docState.id)
      if (res.success) toast.success('Documento finalizado.')
      return res
    })
  }

  async function handleReceive() {
    if (!confirm(`Confirmar recebimento total de ${formatCentsBRL(docState.totalAmount)}?`)) return
    await run('receive', async () => {
      const res = await markDocumentReceivedAction(docState.id)
      if (res.success) toast.success('Recebimento total registrado.')
      return res
    })
  }

  async function handleUndo() {
    if (!confirm('Desfazer o recebimento? O valor recebido voltará a zero.')) return
    await run('undo', async () => {
      const res = await undoDocumentPaymentAction(docState.id)
      if (res.success) toast.success('Recebimento desfeito.')
      return res
    })
  }

  const infoRow = 'flex items-center justify-between text-sm py-1.5'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/documents">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {documentTypeLabel(docState.type)}
          </span>
          <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight truncate">
            {docState.title}
          </h1>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-3xl p-6 border border-border main-container-shadow space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground">Status Operacional</h2>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${operationalStatusBadgeClass(docState.status)}`}>
              {operationalStatusLabel(docState.status)}
            </span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
            <div className={infoRow}>
              <span>Criado em</span>
              <span className="text-foreground">{new Date(docState.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            {docState.completedAt && (
              <div className={infoRow}>
                <span>Finalizado em</span>
                <span className="text-foreground">{new Date(docState.completedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl p-6 border border-border main-container-shadow space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground">Status Financeiro</h2>
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${paymentStatusBadgeClass(docState.paymentStatus)}`}>
              {paymentStatusLabel(docState.paymentStatus)}
            </span>
          </div>
          {isFinancial && (
            <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
              <div className={infoRow}>
                <span>Valor total</span>
                <span className="font-semibold text-foreground">{formatCentsBRL(docState.totalAmount)}</span>
              </div>
              <div className={infoRow}>
                <span>Valor recebido</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCentsBRL(docState.receivedAmount)}
                </span>
              </div>
              <div className={infoRow}>
                <span>Saldo pendente</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCentsBRL(remainingCents)}</span>
              </div>
              {docState.receivedAt && (
                <div className={infoRow}>
                  <span>Recebido em</span>
                  <span className="text-foreground">{new Date(docState.receivedAt).toLocaleDateString('pt-BR')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-card rounded-3xl p-6 border border-border main-container-shadow flex flex-wrap gap-3">
        {docState.status !== 'finalizado' && (
          <Button
            onClick={handleFinalize}
            disabled={!!busy}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold gap-1.5 h-10"
          >
            {busy === 'finalize' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Marcar como finalizado
          </Button>
        )}

        {isFinancial && !fullyPaid && (
          <>
            <Button
              onClick={handleReceive}
              disabled={!!busy}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-1.5 h-10"
            >
              {busy === 'receive' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
              Marcar como recebido
            </Button>
            <Button
              variant="outline"
              onClick={() => setPartialOpen(true)}
              disabled={!!busy}
              className="rounded-xl text-xs font-semibold border-border text-foreground hover:bg-accent gap-1.5 h-10"
            >
              <Receipt className="w-4 h-4" /> Recebimento parcial
            </Button>
          </>
        )}

        {isFinancial && docState.receivedAmount > 0 && (
          <Button
            variant="outline"
            onClick={handleUndo}
            disabled={!!busy}
            className="rounded-xl text-xs font-semibold border-border text-muted-foreground hover:bg-accent gap-1.5 h-10"
          >
            <Undo2 className="w-4 h-4" /> Desfazer recebimento
          </Button>
        )}
      </div>

      {/* Related Documents */}
      <div className="bg-card rounded-3xl p-6 border border-border main-container-shadow space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-foreground">Documentos relacionados</h2>
          <Link
            href={`/documents/new/recibo?linkedTo=${docState.id}`}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Criar recibo relacionado
          </Link>
        </div>

        {related.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl bg-muted">
            <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Nenhum documento vinculado a este.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {related.map((rel) => (
              <li key={rel.relationId} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground">
                    {DOCUMENT_RELATION_TYPE_LABELS[rel.relationType] ?? rel.relationType}
                    {rel.direction === 'target' ? ' (entrada)' : ''}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">{rel.document.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {documentTypeLabel(rel.document.type)} • {operationalStatusLabel(rel.document.status)} •{' '}
                    {formatCentsBRL(rel.document.totalAmount)}
                  </p>
                </div>
                <Link href={`/documents/${rel.document.id}`}>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-border text-foreground hover:bg-accent">
                    Abrir <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Partial Payment Dialog */}
      <PartialPaymentDialog
        open={partialOpen}
        onClose={() => setPartialOpen(false)}
        remainingCents={remainingCents}
        totalCents={docState.totalAmount}
        receivedCents={docState.receivedAmount}
        paymentStatus={docState.paymentStatus}
        onSubmit={async (values) => {
          const res = await run('partial', () => registerPartialPaymentAction(docState.id, values))
          if (res?.success) toast.success('Recebimento parcial registrado.')
          return !!res?.success
        }}
      />
    </div>
  )
}

interface PartialPaymentDialogProps {
  open: boolean
  onClose: () => void
  remainingCents: number
  totalCents: number
  receivedCents: number
  paymentStatus: string
  onSubmit: (values: { amount: number; receivedAt?: string; paymentMethod?: string; notes?: string }) => Promise<boolean>
}

function PartialPaymentDialog({
  open,
  onClose,
  remainingCents,
  totalCents,
  receivedCents,
  paymentStatus,
  onSubmit,
}: PartialPaymentDialogProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [method, setMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountNum = Number(amount.replace(',', '.'))
  const isValid = Number.isFinite(amountNum) && amountNum > 0 && amountNum <= remainingCents / 100
  const inputCls = 'h-10 rounded-xl bg-muted border-border text-sm'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!(Number.isFinite(amountNum) && amountNum > 0)) {
      setError('Informe um valor maior que zero.')
      return
    }
    if (amountNum > remainingCents / 100) {
      setError(`Valor não pode ultrapassar o saldo pendente de ${formatBRL(remainingCents / 100)}.`)
      return
    }
    setSaving(true)
    const ok = await onSubmit({
      amount: amountNum,
      receivedAt: date || undefined,
      paymentMethod: method || undefined,
      notes: notes || undefined,
    })
    setSaving(false)
    if (ok) {
      setAmount('')
      setMethod('')
      setNotes('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar recebimento parcial</DialogTitle>
          <DialogDescription>
            Saldo pendente atual: <strong className="text-foreground">{formatCentsBRL(remainingCents)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-xl bg-muted p-3 text-center">
            <p className="text-muted-foreground">Total</p>
            <p className="font-bold text-foreground mt-0.5">{formatCentsBRL(totalCents)}</p>
          </div>
          <div className="rounded-xl bg-muted p-3 text-center">
            <p className="text-muted-foreground">Recebido</p>
            <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatCentsBRL(receivedCents)}</p>
          </div>
          <div className="rounded-xl bg-muted p-3 text-center">
            <p className="text-muted-foreground">Status</p>
            <p className="font-bold text-foreground mt-0.5">{paymentStatusLabel(paymentStatus)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="partial-amount" className="text-xs font-semibold">Valor recebido (R$) *</Label>
            <Input
              id="partial-amount"
              type="number"
              step="0.01"
              min="0.01"
              max={remainingCents / 100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className={inputCls}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="partial-date" className="text-xs font-semibold">Data do recebimento</Label>
              <Input
                id="partial-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partial-method" className="text-xs font-semibold">Forma de pagamento</Label>
              <select
                id="partial-method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className={`w-full ${inputCls} rounded-xl border border-border bg-muted px-3 text-sm focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary text-foreground`}
              >
                <option value="">Selecione</option>
                <option value="PIX">PIX</option>
                <option value="Transferência Bancária">Transferência Bancária</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Boleto">Boleto</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partial-notes" className="text-xs font-semibold">Observações</Label>
            <Textarea
              id="partial-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: entrada de 50%, restante em 30 dias..."
              rows={2}
              className="rounded-xl bg-muted border-border text-sm"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="rounded-xl text-xs">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving || !isValid}
              aria-busy={saving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-1.5"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Registrar recebimento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
