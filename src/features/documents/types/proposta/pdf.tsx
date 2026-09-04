import { View, Text } from '@react-pdf/renderer'
import {
  DocumentPdfPage,
  DocumentPdfHeader,
  DocumentPdfClient,
  DocumentPdfFooter,
  docPdfStyles,
  pdfBRL,
  pdfDate,
  documentColors,
  documentSpacing,
} from '@/features/documents/components/document-pdf-shared'

export function PropostaPdf({ data }: { data: any }) {
  const totalInvestment =
    data.investment?.reduce((acc: number, item: any) => acc + Number(item.amount || 0), 0) || 0

  const headerInfo = {
    title: 'Proposta Comercial',
    number: data?.proposalNumber || undefined,
    issuedAt: new Date(),
    validUntil: data?.validUntil,
    extraLines: data?.title ? [data.title] : [],
  }

  return (
    <DocumentPdfPage>
      <DocumentPdfHeader company={data?.company} info={headerInfo} />

      <DocumentPdfClient client={data?.client} fallbackName={data?.clientName} />

      {data?.introduction && (
        <View style={{ marginTop: documentSpacing.sectionGap }}>
          <Text style={docPdfStyles.sectionTitle}>Apresentação</Text>
          <Text style={docPdfStyles.sectionText}>{data.introduction}</Text>
        </View>
      )}

      {data?.objectives && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Objetivos</Text>
          <Text style={docPdfStyles.sectionText}>{data.objectives}</Text>
        </View>
      )}

      {data?.scope && data.scope.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Escopo Detalhado</Text>
          {data.scope.map((s: any, i: number) => (
            <View key={i} style={{ marginBottom: 8, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: documentColors.border }} wrap={false}>
              <Text style={[docPdfStyles.sectionText, { fontWeight: 'bold', color: documentColors.textStrong }]}>
                {i + 1}. {s.title}
              </Text>
              <Text style={docPdfStyles.sectionText}>{s.description}</Text>
              {s.deliverables && (
                <Text style={[docPdfStyles.sectionText, { color: documentColors.textMuted, fontSize: 8 }]}>
                  Entregáveis: {s.deliverables}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {data?.timeline && data.timeline.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Cronograma Estimado</Text>
          <View style={docPdfStyles.tableHead}>
            <Text style={[docPdfStyles.th, { flex: 2 }]}>Fase</Text>
            <Text style={[docPdfStyles.th, { flex: 1 }]}>Duração</Text>
            <Text style={[docPdfStyles.th, { flex: 1.5, textAlign: 'right' }]}>Marco</Text>
          </View>
          {data.timeline.map((t: any, i: number) => (
            <View key={i} style={docPdfStyles.tableRow} wrap={false}>
              <Text style={[docPdfStyles.td, { flex: 2, fontWeight: 'bold' }]}>{t.phase}</Text>
              <Text style={[docPdfStyles.td, { flex: 1 }]}>{t.duration}</Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right', color: documentColors.textMuted }]}>
                {t.milestone || '—'}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data?.investment && data.investment.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Investimento</Text>
          <View style={docPdfStyles.tableHead}>
            <Text style={[docPdfStyles.th, { flex: 3 }]}>Item</Text>
            <Text style={[docPdfStyles.th, { flex: 2 }]}>Condição</Text>
            <Text style={[docPdfStyles.th, { flex: 1.5, textAlign: 'right' }]}>Valor</Text>
          </View>
          {data.investment.map((item: any, i: number) => (
            <View key={i} style={docPdfStyles.tableRow} wrap={false}>
              <Text style={[docPdfStyles.td, { flex: 3 }]}>{item.item}</Text>
              <Text style={[docPdfStyles.td, { flex: 2, color: documentColors.textMuted }]}>{item.condition || '—'}</Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>
                {pdfBRL(Number(item.amount || 0))}
              </Text>
            </View>
          ))}
          <View style={[docPdfStyles.totalRow, { marginTop: 8 }]}>
            <Text style={docPdfStyles.totalLabel}>Investimento Total</Text>
            <Text style={docPdfStyles.totalValue}>{pdfBRL(totalInvestment)}</Text>
          </View>
        </View>
      )}

      {data?.terms && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Termos e Condições</Text>
          <Text style={docPdfStyles.sectionText}>{data.terms}</Text>
          <Text style={[docPdfStyles.sectionText, { fontSize: 8, color: documentColors.textFaint }]}>
            Validade: 30 dias a partir da data de emissão
          </Text>
        </View>
      )}

      <DocumentPdfFooter
        company={data?.company}
        info={headerInfo}
        hint="Aceite da proposta — assinatura do cliente abaixo"
        signatureName={data?.client?.name || data?.clientName || 'Nome do Cliente'}
      />
    </DocumentPdfPage>
  )
}
