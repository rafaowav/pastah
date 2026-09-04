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

  const headerInfo = {
    title: 'Orçamento',
    number: data?.orcamentoNumber || '#ORC-0001',
    issuedAt: new Date(),
    validUntil: data?.validUntil,
  }

  return (
    <DocumentPdfPage>
      <DocumentPdfHeader company={data?.company} info={headerInfo} />

      <DocumentPdfClient client={data?.client} fallbackName={data?.clientName} />

      <View style={{ marginTop: documentSpacing.sectionGap }}>
        <View style={docPdfStyles.tableHead}>
          <Text style={[docPdfStyles.th, { flex: 3 }]}>Item / Descrição</Text>
          <Text style={[docPdfStyles.th, { flex: 0.7, textAlign: 'right' }]}>Qtd</Text>
          <Text style={[docPdfStyles.th, { flex: 1.2, textAlign: 'right' }]}>Valor Unit. (R$)</Text>
          <Text style={[docPdfStyles.th, { flex: 0.9, textAlign: 'right' }]}>Desconto</Text>
          <Text style={[docPdfStyles.th, { flex: 1.3, textAlign: 'right' }]}>Subtotal (R$)</Text>
        </View>
        {items.length === 0 ? (
          <View style={docPdfStyles.tableRow}>
            <Text style={[docPdfStyles.td, { flex: 5, textAlign: 'center', color: documentColors.textFaint }]}>
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
              <View key={i} style={docPdfStyles.tableRow}>
                <Text style={[docPdfStyles.td, { flex: 3 }]}>{item.description || 'Item'}</Text>
                <Text style={[docPdfStyles.td, { flex: 0.7, textAlign: 'right' }]}>{qty}</Text>
                <Text style={[docPdfStyles.td, { flex: 1.2, textAlign: 'right' }]}>{pdfBRL(price)}</Text>
                <Text
                  style={[
                    docPdfStyles.td,
                    { flex: 0.9, textAlign: 'right', color: discount > 0 ? documentColors.negative : documentColors.textFaint },
                  ]}
                >
                  {discount > 0 ? `${discount}%` : '—'}
                </Text>
                <Text style={[docPdfStyles.td, { flex: 1.3, textAlign: 'right', fontWeight: 'bold' }]}>
                  {pdfBRL(subtotalItem)}
                </Text>
              </View>
            )
          })
        )}
      </View>

      <View style={{ marginTop: documentSpacing.sectionGap, alignSelf: 'flex-end', width: 260 }}>
        <View style={docPdfStyles.summaryRow}>
          <Text style={docPdfStyles.summaryText}>Subtotal</Text>
          <Text style={docPdfStyles.summaryText}>{pdfBRL(subtotal)}</Text>
        </View>
        {(itemDiscountTotal > 0 || descontoGeral > 0) && (
          <View style={docPdfStyles.summaryRow}>
            <Text style={docPdfStyles.summaryText}>Desconto</Text>
            <Text style={[docPdfStyles.summaryText, { color: documentColors.negative }]}>
              - {pdfBRL(itemDiscountTotal + descontoGeral)}
            </Text>
          </View>
        )}
        <View style={docPdfStyles.totalRow}>
          <Text style={docPdfStyles.totalLabel}>Valor Total (R$)</Text>
          <Text style={docPdfStyles.totalValue}>{pdfBRL(total)}</Text>
        </View>
      </View>

      <View style={[docPdfStyles.infoCard, { flexDirection: 'row', gap: 8, marginTop: documentSpacing.sectionGap, backgroundColor: 'transparent', padding: 0 }]}>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Forma de Pagamento</Text>
          <Text style={docPdfStyles.infoValue}>{data?.paymentTerms || 'Não especificado'}</Text>
        </View>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Prazo de Execução</Text>
          <Text style={docPdfStyles.infoValue}>{data?.deliveryTime || 'A combinar'}</Text>
        </View>
        <View style={docPdfStyles.infoCard}>
          <Text style={docPdfStyles.infoLabel}>Validade da Proposta</Text>
          <Text style={docPdfStyles.infoValue}>{pdfDate(data?.validUntil)}</Text>
        </View>
      </View>

      {data?.observations && (
        <View style={{ marginTop: documentSpacing.sectionGap }}>
          <Text style={docPdfStyles.infoLabel}>Observações</Text>
          <Text style={docPdfStyles.sectionText}>{data.observations}</Text>
        </View>
      )}

      <DocumentPdfFooter
        company={data?.company}
        info={headerInfo}
        hint="Aprovação do cliente — assinatura abaixo"
        signatureName={data?.client?.name || data?.clientName || 'Nome do Cliente'}
      />
    </DocumentPdfPage>
  )
}
