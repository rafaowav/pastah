import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', padding: 40, fontSize: 9, color: '#0f172a' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0f172a',
    marginTop: -40, marginLeft: -40, marginRight: -40, paddingHorizontal: 40, paddingVertical: 30,
  },
  companyBlock: { flexDirection: 'column', gap: 2 },
  companyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  companyLogo: { width: 24, height: 24, borderRadius: 8, backgroundColor: '#3b82f6', color: '#ffffff', fontSize: 12, fontWeight: 'bold', textAlign: 'center', lineHeight: 24 },
  companyName: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  companyMeta: { color: '#cbd5e1', fontSize: 8 },
  docTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'right', textTransform: 'uppercase' },
  docMeta: { color: '#cbd5e1', fontSize: 8, textAlign: 'right' },
  valueBox: { marginTop: 24, alignItems: 'center' },
  valueLabel: { fontSize: 8, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  valueMain: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  valueWords: { fontSize: 9, color: '#64748b', marginTop: 4 },
  parties: { marginTop: 24, flexDirection: 'row', gap: 16 },
  partyBox: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 },
  partyLabel: { fontSize: 7, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  partyName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  partyMeta: { fontSize: 8, color: '#64748b', marginTop: 2 },
  referenceBox: { marginTop: 20, border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 },
  referenceLabel: { fontSize: 7, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  referenceText: { fontSize: 9, color: '#475569', fontStyle: 'italic' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  detailLabel: { fontSize: 9, color: '#64748b' },
  detailValue: { fontSize: 9, fontWeight: 'bold', color: '#0f172a' },
  legalText: { marginTop: 24, fontSize: 9, color: '#475569', lineHeight: 1.5 },
  footer: { marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 24 },
  signatureText: { fontSize: 8, color: '#64748b', marginBottom: 24 },
  signatureLine: { width: 240, borderTop: '1px solid #94a3b8', paddingTop: 4 },
  signatureName: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
})

function formatBRL(value: number): string {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ReceiptPdf({ data }: { data: any }) {
  const valor = Number(data?.amount ?? 0)
  const valorExtenso = data?.amountInWords || ''
  const dataFormatada = data?.paymentDate
    ? new Date(data.paymentDate).toLocaleDateString('pt-BR')
    : ''
  const cidade = data?.city || data?.cityDate || ''

  const emissor = data?.emissorNome || data?.companyName || data?.company?.name || 'Sua Empresa'
  const emissorDoc = data?.emissorCNPJ || data?.companyDocument || data?.company?.document || ''
  const pagador = data?.pagadorNome || data?.clientName || data?.client?.name || 'Nome do Cliente'
  const pagadorDoc = data?.pagadorCPF || data?.clientDocument || data?.client?.document || ''

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.companyBlock}>
          <View style={styles.companyTitleRow}>
            <Text style={styles.companyLogo}>{(emissor[0] || 'P').toUpperCase()}</Text>
            <Text style={styles.companyName}>{emissor}</Text>
          </View>
          {emissorDoc && <Text style={styles.companyMeta}>{emissorDoc}</Text>}
        </View>
        <View>
          <Text style={styles.docTitle}>Recibo de Pagamento</Text>
          <Text style={styles.docMeta}>{data?.receiptNumber || 'RECIBO'}</Text>
          <Text style={styles.docMeta}>Emissão: {dataFormatada || new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <View style={styles.valueBox}>
        <Text style={styles.valueLabel}>Valor Recebido</Text>
        <Text style={styles.valueMain}>{formatBRL(valor)}</Text>
        {valorExtenso && <Text style={styles.valueWords}>({valorExtenso})</Text>}
      </View>

      <View style={styles.parties}>
        <View style={styles.partyBox}>
          <Text style={styles.partyLabel}>Emissor</Text>
          <Text style={styles.partyName}>{emissor}</Text>
          {emissorDoc && <Text style={styles.partyMeta}>{emissorDoc}</Text>}
        </View>
        <View style={styles.partyBox}>
          <Text style={styles.partyLabel}>Pagador</Text>
          <Text style={styles.partyName}>{pagador}</Text>
          {pagadorDoc && <Text style={styles.partyMeta}>{pagadorDoc}</Text>}
        </View>
      </View>

      <View style={styles.referenceBox}>
        <Text style={styles.referenceLabel}>Referente a</Text>
        <Text style={styles.referenceText}>{data?.reference || 'Pagamento não especificado'}</Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Forma de Pagamento</Text>
          <Text style={styles.detailValue}>{data?.paymentMethod || 'Não informada'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Data do Pagamento</Text>
          <Text style={styles.detailValue}>{dataFormatada || 'Não informada'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Local</Text>
          <Text style={styles.detailValue}>{cidade || 'Não informado'}</Text>
        </View>
      </View>

      <View style={styles.legalText}>
        <Text>Recebemos de {pagador} a quantia de {formatBRL(valor)} referente a: {data?.reference || 'pagamento'}.</Text>
        <Text>Termo lavrado em via dupla para maior legitimidade jurídica.</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.signatureText}>
          Local e Data: {cidade ? `${cidade}, ` : ''}{dataFormatada || '__/__/____'}
        </Text>
        <View style={styles.signatureLine}>
          <Text style={styles.signatureName}>{emissor}</Text>
        </View>
        <Text style={[styles.signatureText, { marginTop: 4, marginBottom: 0 }]}>Assinatura do Emissor</Text>
      </View>
    </Page>
  )
}