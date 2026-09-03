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
  clientCard: { marginTop: 24, border: '1px solid #e2e8f0', borderRadius: 10, padding: 16 },
  clientLabel: { fontSize: 7, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  clientName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  clientMeta: { color: '#64748b', fontSize: 8 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionText: { fontSize: 9, color: '#475569', marginBottom: 4, lineHeight: 1.4 },
  scopeItem: { fontSize: 9, color: '#475569', marginBottom: 6, marginLeft: 12 },
  scopeTitle: { fontWeight: 'bold' },
  investmentRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, borderBottom: '1px solid #f1f5f9' },
  investmentLabel: { fontSize: 9, color: '#475569' },
  investmentValue: { fontSize: 9, fontWeight: 'bold', color: '#0f172a' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTop: '2px solid #0f172a', marginTop: 8, paddingTop: 8 },
  totalLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  footer: { marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 24, alignItems: 'center' },
  footerHint: { fontSize: 8, color: '#64748b', marginBottom: 24 },
  signatureLine: { width: 240, borderTop: '1px solid #94a3b8', paddingTop: 4 },
  signatureName: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
})

function formatBRL(value: number): string {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PropostaPdf({ data }: { data: any }) {
  const totalInvestment = data.investment?.reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0) || 0

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.companyBlock}>
          <View style={styles.companyTitleRow}>
            <Text style={styles.companyLogo}>{(data?.company?.name?.[0] || 'P').toUpperCase()}</Text>
            <Text style={styles.companyName}>{data?.company?.name || 'Sua Empresa'}</Text>
          </View>
          {data?.company?.document && <Text style={styles.companyMeta}>CNPJ: {data.company.document}</Text>}
          {data?.company?.email && <Text style={styles.companyMeta}>{data.company.email}</Text>}
          {data?.company?.phone && <Text style={styles.companyMeta}>{data.company.phone}</Text>}
        </View>
        <View>
          <Text style={styles.docTitle}>Proposta Comercial</Text>
          <Text style={styles.docMeta}>{data?.title || ''}</Text>
          <Text style={styles.docMeta}>Emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
          <Text style={styles.docMeta}>Validade: {data?.validUntil ? new Date(data.validUntil).toLocaleDateString('pt-BR') : '30 dias'}</Text>
        </View>
      </View>

      <View style={styles.clientCard}>
        <Text style={styles.clientLabel}>Cliente</Text>
        <Text style={styles.clientName}>{data?.client?.name || data?.clientName || 'Nome do Cliente'}</Text>
        <Text style={[styles.clientMeta]}>
          {data?.client?.document ? `CPF/CNPJ: ${data.client.document}` : ''}
          {data?.client?.email ? ` • ${data.client.email}` : ''}
        </Text>
      </View>

      {data?.introduction && (
        <>
          <Text style={styles.sectionTitle}>Apresentação</Text>
          <Text style={styles.sectionText}>{data.introduction}</Text>
        </>
      )}
      {data?.objectives && (
        <>
          <Text style={styles.sectionTitle}>Objetivos</Text>
          <Text style={styles.sectionText}>{data.objectives}</Text>
        </>
      )}

      {data?.scope && data.scope.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Escopo Detalhado</Text>
          {data.scope.map((s: any, i: number) => (
            <View key={i} style={styles.scopeItem}>
              <Text style={styles.scopeTitle}>{i + 1}. {s.title}</Text>
              <Text>{s.description}</Text>
              {s.deliverables && <Text>Entregáveis: {s.deliverables}</Text>}
            </View>
          ))}
        </>
      )}

      {data?.timeline && data.timeline.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Cronograma</Text>
          {data.timeline.map((t: any, i: number) => (
            <Text key={i} style={styles.sectionText}>
              {t.phase} — {t.duration} {t.milestone ? `(${t.milestone})` : ''}
            </Text>
          ))}
        </>
      )}

      {data?.investment && data.investment.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Investimento</Text>
          {data.investment.map((item: any, i: number) => (
            <View key={i} style={styles.investmentRow}>
              <Text style={styles.investmentLabel}>{item.item}</Text>
              <Text style={styles.investmentValue}>{formatBRL(Number(item.amount || 0))}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatBRL(totalInvestment)}</Text>
          </View>
        </>
      )}

      {data?.terms && (
        <>
          <Text style={styles.sectionTitle}>Termos e Condições</Text>
          <Text style={styles.sectionText}>{data.terms}</Text>
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerHint}>Aceite e assinatura do cliente</Text>
        <View style={styles.signatureLine}>
          <Text style={styles.signatureName}>{data?.client?.name || data?.clientName || 'Nome do Cliente'}</Text>
        </View>
      </View>
    </Page>
  )
}