import { View, Text } from '@react-pdf/renderer'
import {
  DocumentPdfPage,
  DocumentPdfHeader,
  DocumentPdfFooter,
  docPdfStyles,
  pdfDate,
  documentColors,
  documentSpacing,
} from '@/features/documents/components/document-pdf-shared'

const clauseLabels = [
  'Cláusula Primeira — Do Objeto',
  'Cláusula Segunda — Das Obrigações da Contratada',
  'Cláusula Terceira — Das Obrigações do Contratante',
  'Cláusula Quarta — Do Preço, Condições de Pagamento e Multa por Atraso',
  'Cláusula Quinta — Vigência e Rescisão',
  'Cláusula Sexta — Do Foro de Eleição',
]

const clauseKeys = [
  'clause1Object',
  'clause2ObligationsContractor',
  'clause3ObligationsClient',
  'clause4Payment',
  'clause5DurationTermination',
  'clause6Jurisdiction',
]

export function ContractPdf({ data }: { data: any }) {
  const contractor = data?.contractorRepresentative || {}
  const clientRep = data?.clientRepresentative || {}
  const clauses = data?.clauses || {}
  const witnesses = data?.witnesses || []
  const company = data?.company

  const headerInfo = {
    title: 'Contrato',
    number: data?.contractNumber || undefined,
    issuedAt: new Date(),
    extraLines: data?.contractTitle ? [data.contractTitle] : [],
  }

  return (
    <DocumentPdfPage>
      <DocumentPdfHeader company={company} info={headerInfo} />

      {/* Qualificação das partes */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: documentSpacing.sectionGap }}>
        <View style={[docPdfStyles.infoCard, { border: `1px solid ${documentColors.border}` }]}>
          <Text style={docPdfStyles.infoLabel}>Contratada</Text>
          <Text style={[docPdfStyles.clientName, { marginBottom: 0 }]}>
            {contractor.name || company?.name || 'Não informado'}
          </Text>
          {(contractor.cpf || company?.document) && (
            <Text style={docPdfStyles.clientField}>CPF/CNPJ: {contractor.cpf || company?.document}</Text>
          )}
          {contractor.role ? <Text style={docPdfStyles.clientField}>Representante: {contractor.role}</Text> : null}
        </View>
        <View style={[docPdfStyles.infoCard, { border: `1px solid ${documentColors.border}` }]}>
          <Text style={docPdfStyles.infoLabel}>Contratante</Text>
          <Text style={[docPdfStyles.clientName, { marginBottom: 0 }]}>
            {clientRep.name || data?.client?.name || 'Nome do Cliente'}
          </Text>
          {(clientRep.cpf || data?.client?.document) && (
            <Text style={docPdfStyles.clientField}>CPF/CNPJ: {clientRep.cpf || data?.client?.document}</Text>
          )}
          {clientRep.role ? <Text style={docPdfStyles.clientField}>Representante: {clientRep.role}</Text> : null}
        </View>
      </View>

      {/* Cláusulas — título azul-marinho, texto justificado, quebra segura */}
      {clauseKeys.some((k) => clauses[k]) && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Cláusulas Contratuais</Text>
          {clauseKeys.map((key, index) => {
            const text = clauses[key]
            if (!text) return null
            return (
              <View key={key} style={{ marginBottom: 10 }} wrap={false}>
                <Text
                  style={{
                    fontSize: 8,
                    fontWeight: 'bold',
                    color: documentColors.headerBg,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  {clauseLabels[index]}
                </Text>
                <Text style={{ fontSize: 9, color: '#475569', lineHeight: 1.5, textAlign: 'justify' }}>
                  {text}
                </Text>
              </View>
            )
          })}
        </View>
      )}

      {witnesses.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Testemunhas</Text>
          {witnesses.map((w: any, i: number) => (
            <Text key={i} style={docPdfStyles.sectionText}>
              • {w.name}
              {w.cpf ? ` — CPF: ${w.cpf}` : ''}
            </Text>
          ))}
        </View>
      )}

      <DocumentPdfFooter
        company={company}
        info={headerInfo}
        signatures={[
          { label: 'Contratada', name: contractor.name || company?.name || '' },
          { label: 'Contratante', name: clientRep.name || data?.client?.name || '' },
        ]}
      />
    </DocumentPdfPage>
  )
}
