import { View, Text } from '@react-pdf/renderer'
import {
  DocumentPdfPage,
  DocumentPdfHeader,
  DocumentPdfFooter,
  docPdfStyles,
  pdfBRL,
  pdfDate,
  documentColors,
  documentSpacing,
} from '@/features/documents/components/document-pdf-shared'

export function ReceiptPdf({ data }: { data: any }) {
  const valor = Number(data?.amount ?? 0)
  const valorExtenso = data?.amountInWords || ''
  const dataFormatada = data?.paymentDate ? pdfDate(data.paymentDate) : ''
  const cidade = data?.city || data?.cityDate || ''

  const emissor = data?.emissorNome || data?.companyName || data?.company?.name || 'Sua Empresa'
  const emissorDoc = data?.emissorCNPJ || data?.companyDocument || data?.company?.document || ''
  const pagador = data?.pagadorNome || data?.clientName || data?.client?.name || 'Nome do Cliente'
  const pagadorDoc = data?.pagadorCPF || data?.clientDocument || data?.client?.document || ''

  const headerInfo = {
    title: 'Recibo de Pagamento',
    number: data?.receiptNumber || 'RECIBO',
    issuedAt: data?.paymentDate || new Date(),
    extraLines: data?.paymentMethod ? [data.paymentMethod] : [],
  }

  return (
    <DocumentPdfPage>
      <DocumentPdfHeader company={data?.company} info={headerInfo} />

      {/* Valor em destaque */}
      <View
        style={{
          marginTop: documentSpacing.sectionGap,
          backgroundColor: documentColors.cardBg,
          border: `1px solid ${documentColors.border}`,
          borderRadius: 10,
          padding: 24,
          alignItems: 'center',
        }}
      >
        <Text style={[docPdfStyles.infoLabel, { marginBottom: 6 }]}>Valor Recebido</Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: documentColors.headerBg }}>
          {pdfBRL(valor)}
        </Text>
        {valorExtenso && (
          <Text style={{ fontSize: 9, color: documentColors.textMuted, marginTop: 4 }}>({valorExtenso})</Text>
        )}
      </View>

      {/* Emissor e Pagador */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: documentSpacing.sectionGap }}>
        <View style={[docPdfStyles.infoCard, { border: `1px solid ${documentColors.border}` }]}>
          <Text style={docPdfStyles.infoLabel}>Emissor</Text>
          <Text style={[docPdfStyles.clientName, { marginBottom: 0 }]}>{emissor}</Text>
          {emissorDoc ? <Text style={docPdfStyles.clientField}>{emissorDoc}</Text> : null}
        </View>
        <View style={[docPdfStyles.infoCard, { border: `1px solid ${documentColors.border}` }]}>
          <Text style={docPdfStyles.infoLabel}>Pagador</Text>
          <Text style={[docPdfStyles.clientName, { marginBottom: 0 }]}>{pagador}</Text>
          {pagadorDoc ? <Text style={docPdfStyles.clientField}>{pagadorDoc}</Text> : null}
        </View>
      </View>

      {/* Referente a */}
      <View style={{ marginTop: documentSpacing.sectionGap }}>
        <Text style={docPdfStyles.infoLabel}>Referente a</Text>
        <Text style={[docPdfStyles.sectionText, { fontStyle: 'italic' }]}>
          {data?.reference || 'Pagamento não especificado'}
        </Text>
      </View>

      {/* Detalhes */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: documentSpacing.sectionGap }}>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Forma de Pagamento</Text>
          <Text style={docPdfStyles.infoValue}>{data?.paymentMethod || 'Não informada'}</Text>
        </View>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Data do Pagamento</Text>
          <Text style={docPdfStyles.infoValue}>{dataFormatada || 'Não informada'}</Text>
        </View>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Local</Text>
          <Text style={docPdfStyles.infoValue}>{cidade || 'Não informado'}</Text>
        </View>
      </View>

      {/* Declaração legal */}
      <View style={{ marginTop: documentSpacing.sectionGap }}>
        <Text style={docPdfStyles.sectionText}>
          Recebemos de {pagador} a quantia de {pdfBRL(valor)} referente a: {data?.reference || 'pagamento'}.
        </Text>
        <Text style={[docPdfStyles.sectionText, { fontSize: 8, color: documentColors.textFaint }]}>
          Termo lavrado em via dupla para maior legitimidade jurídica.
        </Text>
      </View>

      <DocumentPdfFooter
        company={data?.company}
        info={headerInfo}
        signatures={[
          { label: 'Assinatura do Emitidor', name: emissor },
          {
            label: 'Local e Data',
            name: cidade ? `${cidade}, ${dataFormatada || '__/__/____'}` : dataFormatada || '__/__/____',
          },
        ]}
      />
    </DocumentPdfPage>
  )
}
