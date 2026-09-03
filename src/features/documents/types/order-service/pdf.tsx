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
  clientName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  summaryText: { fontSize: 9, color: '#475569' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTop: '2px solid #0f172a', marginTop: 8, paddingTop: 8 },
  totalLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionText: { fontSize: 9, color: '#475569', marginBottom: 4, lineHeight: 1.4 },
  tableHead: { flexDirection: 'row', borderBottom: '2px solid #e2e8f0', paddingVertical: 8 },
  th: { fontSize: 7, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', borderBottom: '1px solid #f1f5f9', paddingVertical: 8 },
  td: { fontSize: 9 },
  footer: { marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 24 },
  footerText: { fontSize: 8, color: '#64748b', textAlign: 'center' },
})

function formatBRL(value: number): string {
  return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function OrderServicePdf({ data }: { data: any }) {
  const services = data?.services ?? []
  const parts = data?.parts ?? []

  const partsTotal = parts.reduce((acc: number, item: any) => acc + Number(item.total || item.quantity * item.unitPrice || 0), 0)
  const servicesTotal = services.reduce((acc: number, item: any) => acc + Number(item.total || item.hours * item.laborRate || 0), 0)
  const overallTotal = partsTotal + servicesTotal
  const statusKey = data?.status || 'Aberta'

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
        </View>
        <View>
          <Text style={styles.docTitle}>Ordem de Serviço</Text>
          <Text style={styles.docMeta}>OS #{data?.osNumber || ''}</Text>
          <Text style={styles.docMeta}>Status: {statusKey}</Text>
          <Text style={styles.docMeta}>Emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>

      <View style={styles.clientCard}>
        <Text style={styles.clientLabel}>Cliente</Text>
        <Text style={styles.clientName}>{data?.client?.name || data?.clientName || 'Nome do Cliente'}</Text>
        <Text style={[styles.companyMeta, { marginTop: 2 }]}>
          {data?.client?.phone || data?.client?.email || ''}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 10 }}>
          <Text style={[styles.th, { marginBottom: 4 }]}>Técnico</Text>
          <Text style={[styles.td, { fontWeight: 'bold' }]}>{data?.technician || 'Não designado'}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 10 }}>
          <Text style={[styles.th, { marginBottom: 4 }]}>Status</Text>
          <Text style={[styles.td, { fontWeight: 'bold' }]}>{statusKey}</Text>
        </View>
      </View>

      {data?.equipment?.name && (
        <View style={{ marginTop: 16, backgroundColor: '#f8fafc', borderRadius: 8, padding: 10 }}>
          <Text style={[styles.th, { marginBottom: 4 }]}>Equipamento</Text>
          <Text style={[styles.td, { fontWeight: 'bold' }]}>{data.equipment.name}</Text>
          <Text style={styles.td}>
            {data.equipment.brand || ''} {data.equipment.model || ''}
            {data.equipment.serialNumber ? ` — Nº Série: ${data.equipment.serialNumber}` : ''}
          </Text>
          {data.equipment.conditionNotes && <Text style={[styles.td, { marginTop: 4, color: '#64748b' }]}>{data.equipment.conditionNotes}</Text>}
        </View>
      )}

      {data?.reportedProblem && (
        <>
          <Text style={styles.sectionTitle}>Defeito Reportado</Text>
          <Text style={styles.sectionText}>{data.reportedProblem}</Text>
        </>
      )}

      {data?.technicalDiagnosis && (
        <>
          <Text style={styles.sectionTitle}>Diagnóstico Técnico</Text>
          <Text style={styles.sectionText}>{data.technicalDiagnosis}</Text>
        </>
      )}

      {parts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Peças e Materiais</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.th, { flex: 3 }]}>Peça/Material</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Qtd</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Valor Unit.</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Subtotal</Text>
          </View>
          {parts.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 3 }]}>{item.partName}</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{item.quantity}</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{formatBRL(Number(item.unitPrice || 0))}</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{formatBRL(item.total || item.quantity * item.unitPrice || 0)}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Peças</Text>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>{formatBRL(partsTotal)}</Text>
          </View>
        </>
      )}

      {services.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Mão de Obra</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.th, { flex: 3 }]}>Serviço</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Horas</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>R$/h</Text>
            <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
          </View>
          {services.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 3 }]}>{item.description}</Text>
              <Text style={[styles.td, { flex: 1, textAlign: 'right' }]}>{item.hours || 0}</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{formatBRL(Number(item.laborRate || 0))}</Text>
              <Text style={[styles.td, { flex: 1.5, textAlign: 'right' }]}>{formatBRL(item.total || item.hours * item.laborRate || 0)}</Text>
            </View>
          ))}
          <View style={[styles.summaryRow, { marginTop: 8 }]}>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>Total Mão de Obra</Text>
            <Text style={[styles.summaryText, { fontWeight: 'bold' }]}>{formatBRL(servicesTotal)}</Text>
          </View>
        </>
      )}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Geral</Text>
        <Text style={styles.totalValue}>{formatBRL(overallTotal)}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {data?.warrantyTerms ? `Garantia: ${data.warrantyTerms}` : 'Garantia: 30 dias a contar da conclusão'}
        </Text>
        <Text style={[styles.footerText, { marginTop: 20 }]}>_______________________________ cliente _______________________________ técnico</Text>
      </View>
    </Page>
  )
}