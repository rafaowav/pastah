import { Document, pdf } from '@react-pdf/renderer'
import { getDocument } from '@/lib/document-engine/registry'

export async function generateDocumentPdf(type: string, data: Record<string, any>) {
  const config = getDocument(type)

  // Use the type-specific PDF component when available, otherwise fall back to a
  // safe generic layout so every document type can still be exported.
  const PdfComponent = config.pdf

  if (!PdfComponent) {
    return generateFallbackPdf(type, data)
  }

  const doc = (
    <Document>
      <PdfComponent data={data} />
    </Document>
  )

  return pdf(doc).toBlob()
}

async function generateFallbackPdf(type: string, data: Record<string, any>) {
  const { Document, Page, Text, View, StyleSheet } = await import('@react-pdf/renderer')
  const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 10, color: '#0f172a' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    section: { marginBottom: 6 },
    label: { fontWeight: 'bold' },
  })

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{type.toUpperCase()}</Text>
        <Text style={styles.section}>{data.title || ''}</Text>
        {data.client?.name && (
          <View style={styles.section}>
            <Text style={styles.label}>Cliente: </Text>
            <Text>{data.client.name}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
  return pdf(doc).toBlob()
}
