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

export function OrderServicePdf({ data }: { data: any }) {
  const services = data?.services ?? []
  const parts = data?.parts ?? []

  const partsTotal = parts.reduce(
    (acc: number, item: any) => acc + Number(item.total || item.quantity * item.unitPrice || 0),
    0
  )
  const servicesTotal = services.reduce(
    (acc: number, item: any) => acc + Number(item.total || item.hours * item.laborRate || 0),
    0
  )
  const overallTotal = partsTotal + servicesTotal
  const statusKey = data?.status || 'Aberta'

  const headerInfo = {
    title: 'Ordem de Serviço',
    number: data?.osNumber || '',
    issuedAt: data?.entryDate || new Date(),
    validUntil: data?.expectedDate,
    status: statusKey,
  }

  // Tabelas técnicas com cabeçalho azul-marinho
  const techTableHead = {
    flexDirection: 'row' as const,
    backgroundColor: documentColors.headerBg,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 6,
  }
  const techTh = {
    fontSize: 7,
    fontWeight: 'bold' as const,
    color: '#ffffff',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  }

  return (
    <DocumentPdfPage>
      <DocumentPdfHeader company={data?.company} info={headerInfo} />

      <DocumentPdfClient client={data?.client} fallbackName={data?.clientName} />

      {/* Técnico e Equipamento */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: documentSpacing.blockGap }}>
        <View style={[docPdfStyles.infoCard, { flex: 1 }]}>
          <Text style={docPdfStyles.infoLabel}>Técnico Responsável</Text>
          <Text style={docPdfStyles.infoValue}>{data?.technician || 'Não designado'}</Text>
        </View>
        <View style={[docPdfStyles.infoCard, { flex: 2 }]}>
          <Text style={docPdfStyles.infoLabel}>Equipamento</Text>
          <Text style={docPdfStyles.infoValue}>{data?.equipment?.name || '—'}</Text>
          <Text style={{ fontSize: 8, color: documentColors.textMuted, marginTop: 2 }}>
            {[data?.equipment?.brand, data?.equipment?.model].filter(Boolean).join(' • ')}
            {data?.equipment?.serialNumber ? ` • Nº Série: ${data.equipment.serialNumber}` : ''}
          </Text>
        </View>
      </View>

      {data?.equipment?.conditionNotes && (
        <View style={{ marginTop: 8 }}>
          <Text style={docPdfStyles.sectionText}>{data.equipment.conditionNotes}</Text>
        </View>
      )}

      {data?.reportedProblem && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Defeito Reportado</Text>
          <Text style={docPdfStyles.sectionText}>{data.reportedProblem}</Text>
        </View>
      )}

      {data?.technicalDiagnosis && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Diagnóstico Técnico</Text>
          <Text style={docPdfStyles.sectionText}>{data.technicalDiagnosis}</Text>
        </View>
      )}

      {parts.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Peças e Materiais Utilizados</Text>
          <View style={techTableHead}>
            <Text style={[techTh, { flex: 3 }]}>Peça/Material</Text>
            <Text style={[techTh, { flex: 0.8, textAlign: 'right' }]}>Qtd</Text>
            <Text style={[techTh, { flex: 1.5, textAlign: 'right' }]}>Valor Unit.</Text>
            <Text style={[techTh, { flex: 1.5, textAlign: 'right' }]}>Subtotal</Text>
          </View>
          {parts.map((item: any, i: number) => (
            <View key={i} style={docPdfStyles.tableRow} wrap={false}>
              <Text style={[docPdfStyles.td, { flex: 3 }]}>{item.partName || '—'}</Text>
              <Text style={[docPdfStyles.td, { flex: 0.8, textAlign: 'right' }]}>{item.quantity ?? 0}</Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right' }]}>
                {pdfBRL(Number(item.unitPrice || 0))}
              </Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>
                {pdfBRL(Number(item.total || item.quantity * item.unitPrice || 0))}
              </Text>
            </View>
          ))}
          <View style={[docPdfStyles.summaryRow, { marginTop: 8, justifyContent: 'flex-end', gap: 32 }]}>
            <Text style={[docPdfStyles.summaryText, { fontWeight: 'bold' }]}>Total Peças</Text>
            <Text style={[docPdfStyles.summaryText, { fontWeight: 'bold' }]}>{pdfBRL(partsTotal)}</Text>
          </View>
        </View>
      )}

      {services.length > 0 && (
        <View>
          <Text style={docPdfStyles.sectionTitle}>Mão de Obra</Text>
          <View style={techTableHead}>
            <Text style={[techTh, { flex: 3 }]}>Serviço</Text>
            <Text style={[techTh, { flex: 0.8, textAlign: 'right' }]}>Horas</Text>
            <Text style={[techTh, { flex: 1.5, textAlign: 'right' }]}>R$/h</Text>
            <Text style={[techTh, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
          </View>
          {services.map((item: any, i: number) => (
            <View key={i} style={docPdfStyles.tableRow} wrap={false}>
              <Text style={[docPdfStyles.td, { flex: 3 }]}>{item.description || '—'}</Text>
              <Text style={[docPdfStyles.td, { flex: 0.8, textAlign: 'right' }]}>{item.hours ?? 0}</Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right' }]}>
                {pdfBRL(Number(item.laborRate || 0))}
              </Text>
              <Text style={[docPdfStyles.td, { flex: 1.5, textAlign: 'right', fontWeight: 'bold' }]}>
                {pdfBRL(Number(item.total || item.hours * item.laborRate || 0))}
              </Text>
            </View>
          ))}
          <View style={[docPdfStyles.summaryRow, { marginTop: 8, justifyContent: 'flex-end', gap: 32 }]}>
            <Text style={[docPdfStyles.summaryText, { fontWeight: 'bold' }]}>Total Mão de Obra</Text>
            <Text style={[docPdfStyles.summaryText, { fontWeight: 'bold' }]}>{pdfBRL(servicesTotal)}</Text>
          </View>
        </View>
      )}

      <View style={[docPdfStyles.totalRow, { marginTop: 12 }]}>
        <Text style={docPdfStyles.totalLabel}>Total Geral (R$)</Text>
        <Text style={docPdfStyles.totalValue}>{pdfBRL(overallTotal)}</Text>
      </View>

      <View>
        <Text style={docPdfStyles.sectionTitle}>Termo de Retirada e Garantia</Text>
        <Text style={docPdfStyles.sectionText}>
          O cliente declara ter recebido o equipamento/serviço em perfeito estado. A garantia cobre{' '}
          {data?.warrantyTerms || '30 dias'} a contar da data de conclusão.
        </Text>
      </View>

      <DocumentPdfFooter
        company={data?.company}
        info={{ ...headerInfo, issuedAt: data?.entryDate || new Date() }}
        signatures={[
          { label: 'Cliente', name: data?.client?.name || data?.clientName || '' },
          { label: 'Técnico Responsável', name: data?.technician || '' },
        ]}
      />
    </DocumentPdfPage>
  )
}
