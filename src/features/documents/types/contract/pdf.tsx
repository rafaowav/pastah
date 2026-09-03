import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', padding: 40, fontSize: 9, color: '#0f172a' },
  header: {
    alignItems: 'center', backgroundColor: '#0f172a',
    marginTop: -40, marginLeft: -40, marginRight: -40, paddingHorizontal: 40, paddingVertical: 30,
  },
  docTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
  docSubtitle: { color: '#cbd5e1', fontSize: 10, textAlign: 'center', marginTop: 4 },
  companyName: { color: '#cbd5e1', fontSize: 8, textAlign: 'center', marginTop: 8 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', color: '#0f172a', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  parties: { marginTop: 16, flexDirection: 'row', gap: 16 },
  partyBox: { flex: 1, border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 },
  partyLabel: { fontSize: 7, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1 },
  partyName: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  partyMeta: { fontSize: 8, color: '#64748b', marginTop: 2 },
  clauseCard: { border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, marginTop: 10 },
  clauseTitle: { fontSize: 8, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  clauseText: { fontSize: 9, color: '#475569', lineHeight: 1.5, textAlign: 'justify' },
  witnessText: { fontSize: 9, color: '#475569', marginTop: 4 },
  footer: { marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 24 },
  sigRow: { flexDirection: 'row', gap: 40, marginTop: 24 },
  sigBlock: { flex: 1 },
  sigLabel: { fontSize: 8, color: '#64748b', marginBottom: 8 },
  sigLine: { width: '100%', borderTop: '1px solid #94a3b8', paddingTop: 4, marginTop: 24 },
  sigName: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
})

const clauseLabels = [
  'CLÁUSULA PRIMEIRA - DO OBJETO',
  'CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES DA CONTRATADA',
  'CLÁUSULA TERCEIRA - DAS OBRIGAÇÕES DO CONTRATANTE',
  'CLÁUSULA QUARTA - DO PREÇO, CONDIÇÕES DE PAGAMENTO E MULTA POR ATRASO',
  'CLÁUSULA QUINTA - VIGÊNCIA E RESCISÃO',
  'CLÁUSULA SEXTA - DO FORO DE ELEIÇÃO',
]

const clauseKeys = ['clause1Object', 'clause2ObligationsContractor', 'clause3ObligationsClient', 'clause4Payment', 'clause5DurationTermination', 'clause6Jurisdiction']

export function ContractPdf({ data }: { data: any }) {
  const contractor = data?.contractorRepresentative || {}
  const clientRep = data?.clientRepresentative || {}
  const clauses = data?.clauses || {}
  const witnesses = data?.witnesses || []
  const company = data?.company

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.docTitle}>Contrato de Prestação de Serviços</Text>
        <Text style={styles.docSubtitle}>{data?.contractTitle || 'Contrato de Prestação de Serviços'}</Text>
        {company?.name && <Text style={styles.companyName}>{company.name}</Text>}
      </View>

      <Text style={styles.sectionTitle}>Qualificação das Partes</Text>
      <View style={styles.parties}>
        <View style={styles.partyBox}>
          <Text style={styles.partyLabel}>Contratada</Text>
          <Text style={styles.partyName}>{contractor.name || 'Não informado'}</Text>
          {contractor.cpf && <Text style={styles.partyMeta}>CPF/CNPJ: {contractor.cpf}</Text>}
          {contractor.role && <Text style={styles.partyMeta}>Função: {contractor.role}</Text>}
        </View>
        <View style={styles.partyBox}>
          <Text style={styles.partyLabel}>Contratante</Text>
          <Text style={styles.partyName}>{clientRep.name || 'Nome do Cliente'}</Text>
          {clientRep.cpf && <Text style={styles.partyMeta}>CPF/CNPJ: {clientRep.cpf}</Text>}
          {clientRep.role && <Text style={styles.partyMeta}>Função: {clientRep.role}</Text>}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cláusulas</Text>
      {clauseKeys.map((key, index) => {
        const clauseText = clauses[key]
        if (!clauseText) return null
        return (
          <View key={key} style={styles.clauseCard}>
            <Text style={styles.clauseTitle}>{clauseLabels[index]}</Text>
            <Text style={styles.clauseText}>{clauseText}</Text>
          </View>
        )
      })}

      {witnesses.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Testemunhas</Text>
          {witnesses.map((w: any, i: number) => (
            <Text key={i} style={styles.witnessText}>
              • {w.name}{w.cpf ? ` — CPF: ${w.cpf}` : ''}
            </Text>
          ))}
        </>
      )}

      <View style={styles.footer}>
        <Text style={{ fontSize: 9, color: '#475569' }}>
          Local e Data: _________________________, ___/___/______
        </Text>
        <View style={styles.sigRow}>
          <View style={styles.sigBlock}>
            <Text style={styles.sigLabel}>Assinatura da Contratada</Text>
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{contractor.name || ''}</Text>
            </View>
          </View>
          <View style={styles.sigBlock}>
            <Text style={styles.sigLabel}>Assinatura do Contratante</Text>
            <View style={styles.sigLine}>
              <Text style={styles.sigName}>{clientRep.name || ''}</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  )
}