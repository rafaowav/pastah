import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    fontSize: 9,
    color: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    marginTop: -40,
    marginLeft: -40,
    marginRight: -40,
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  companyBlock: {
    flexDirection: 'column',
    gap: 2,
  },
  companyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyLogo: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  companyName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyMeta: {
    color: '#cbd5e1',
    fontSize: 8,
  },
  docTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  docMeta: {
    color: '#cbd5e1',
    fontSize: 8,
    textAlign: 'right',
  },
  clientCard: {
    marginTop: 24,
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    padding: 16,
  },
  clientLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  clientRow: {
    flexDirection: 'row',
    gap: 16,
  },
  clientField: {
    fontSize: 8,
    color: '#64748b',
  },
  tableHead: {
    flexDirection: 'row',
    borderBottom: '2px solid #e2e8f0',
    paddingVertical: 8,
  },
  th: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #f1f5f9',
    paddingVertical: 8,
  },
  td: {
    fontSize: 9,
  },
  summary: {
    marginTop: 24,
    alignSelf: 'flex-end',
    width: 260,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  summaryText: {
    fontSize: 9,
    color: '#475569',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '2px solid #0f172a',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  infoGrid: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'medium',
    color: '#1e293b',
  },
  observations: {
    marginTop: 24,
  },
  obsLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  obsText: {
    fontSize: 9,
    color: '#475569',
  },
  footer: {
    marginTop: 40,
    borderTop: '1px solid #e2e8f0',
    paddingTop: 24,
    alignItems: 'center',
  },
  footerHint: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 24,
  },
  signatureLine: {
    width: 240,
    borderTop: '1px solid #94a3b8',
    paddingTop: 4,
  },
  signatureName: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#334155',
  },
})

function formatBRL(value: number): string {
  return (value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatDate(value: any): string {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

export function OrcamentoPdf({ data }: { data: any }) {
  const items = data?.items || []

  const subtotal = items.reduce((acc: number, item: any) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    return acc + qty * price * (1 - discount / 100)
  }, 0)

  const itemDiscountTotal = items.reduce((acc: number, item: any) => {
    const qty = Number(item.quantity || 1)
    const price = Number(item.unitPrice || 0)
    const discount = Number(item.discountPercent || 0)
    return acc + qty * price * (discount / 100)
  }, 0)

  const descontoGeral = Number(data?.descontoTotal || 0)
  const total = Math.max(0, subtotal - descontoGeral)

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.companyBlock}>
          <View style={styles.companyTitleRow}>
            <Text style={styles.companyLogo}>
              {(data?.company?.name?.[0] || 'P').toUpperCase()}
            </Text>
            <Text style={styles.companyName}>{data?.company?.name || 'Sua Empresa'}</Text>
          </View>
          {data?.company?.document && (
            <Text style={styles.companyMeta}>CNPJ: {data.company.document}</Text>
          )}
          {data?.company?.email && <Text style={styles.companyMeta}>{data.company.email}</Text>}
          {data?.company?.phone && <Text style={styles.companyMeta}>{data.company.phone}</Text>}
        </View>
        <View>
          <Text style={styles.docTitle}>Orçamento</Text>
          <Text style={styles.docMeta}>Nº {data?.orcamentoNumber || '#ORC-0001'}</Text>
          <Text style={styles.docMeta}>Emissão: {formatDate(new Date())}</Text>
          <Text style={styles.docMeta}>Validade: {formatDate(data?.validUntil)}</Text>
        </View>
      </View>

      <View style={styles.clientCard}>
        <Text style={styles.clientLabel}>Cliente</Text>
        <Text style={styles.clientName}>
          {data?.client?.name || data?.clientName || 'Nome do Cliente'}
        </Text>
        <View style={styles.clientRow}>
          {data?.client?.document && (
            <Text style={styles.clientField}>CPF/CNPJ: {data.client.document}</Text>
          )}
          {data?.client?.email && <Text style={styles.clientField}>{data.client.email}</Text>}
          {data?.client?.phone && <Text style={styles.clientField}>{data.client.phone}</Text>}
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <View style={styles.tableHead}>
          <Text style={[styles.th, { flex: 3 }]}>Item / Descrição</Text>
          <Text style={[styles.th, { flex: 0.7, textAlign: 'right' }]}>Qtd</Text>
          <Text style={[styles.th, { flex: 1.2, textAlign: 'right' }]}>Valor Unit. (R$)</Text>
          <Text style={[styles.th, { flex: 0.9, textAlign: 'right' }]}>Desconto</Text>
          <Text style={[styles.th, { flex: 1.3, textAlign: 'right' }]}>Subtotal (R$)</Text>
        </View>
        {items.length === 0 ? (
          <View style={styles.tableRow}>
            <Text style={[styles.td, { flex: 5, textAlign: 'center', color: '#94a3b8' }]}>
              Nenhum item adicionado
            </Text>
          </View>
        ) : (
          items.map((item: any, i: number) => {
            const qty = Number(item.quantity || 1)
            const price = Number(item.unitPrice || 0)
            const discount = Number(item.discountPercent || 0)
            const subtotalItem = qty * price * (1 - discount / 100)
            return (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.td, { flex: 3 }]}>{item.description || 'Item'}</Text>
                <Text style={[styles.td, { flex: 0.7, textAlign: 'right' }]}>{qty}</Text>
                <Text style={[styles.td, { flex: 1.2, textAlign: 'right' }]}>{formatBRL(price)}</Text>
                <Text style={[styles.td, { flex: 0.9, textAlign: 'right', color: discount > 0 ? '#ef4444' : '#94a3b8' }]}>
                  {discount > 0 ? `${discount}%` : '—'}
                </Text>
                <Text style={[styles.td, { flex: 1.3, textAlign: 'right', fontWeight: 'bold' }]}>
                  {formatBRL(subtotalItem)}
                </Text>
              </View>
            )
          })
        )}
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Subtotal</Text>
          <Text style={styles.summaryText}>{formatBRL(subtotal)}</Text>
        </View>
        {(itemDiscountTotal > 0 || descontoGeral > 0) && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Desconto</Text>
            <Text style={[styles.summaryText, { color: '#ef4444' }]}>
              - {formatBRL(itemDiscountTotal + descontoGeral)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor Total (R$)</Text>
          <Text style={styles.totalValue}>{formatBRL(total)}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Forma de Pagamento</Text>
          <Text style={styles.infoValue}>{data?.paymentTerms || 'Não especificado'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Prazo de Execução</Text>
          <Text style={styles.infoValue}>{data?.deliveryTime || 'A combinar'}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Validade da Proposta</Text>
          <Text style={styles.infoValue}>{formatDate(data?.validUntil)}</Text>
        </View>
      </View>

      {data?.observations && (
        <View style={styles.observations}>
          <Text style={styles.obsLabel}>Observações</Text>
          <Text style={styles.obsText}>{data.observations}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerHint}>Aprovação do cliente — assinatura abaixo</Text>
        <View style={styles.signatureLine}>
          <Text style={styles.signatureName}>
            {data?.client?.name || data?.clientName || 'Nome do Cliente'}
          </Text>
        </View>
      </View>
    </Page>
  )
}
