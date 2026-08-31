import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  section: { marginBottom: 10 },
  table: { marginTop: 20 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', borderBottomStyle: 'solid', paddingVertical: 8 },
  cell: { flex: 1, fontSize: 10 },
  total: { fontSize: 14, fontWeight: 'bold', marginTop: 20, textAlign: 'right' },
})

export interface PdfData {
  title?: string
  type?: string
  client?: { name?: string; [key: string]: any }
  company?: { name?: string; [key: string]: any }
  items?: Array<{
    description?: string
    quantity?: number
    unitPrice?: number
  }>
  observations?: string
  [key: string]: any
}

export async function generatePdf(data: PdfData) {
  const items = data.items || []
  const total = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0)

  const doc = (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>{(data.type || '').toUpperCase()}</Text>
        <Text style={styles.section}>{data.title || ''}</Text>

        {data.client?.name && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold' }}>Client:</Text>
            <Text>{data.client.name}</Text>
          </View>
        )}

        {data.company?.name && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold' }}>Company:</Text>
            <Text>{data.company.name}</Text>
          </View>
        )}

        {items.length > 0 && (
          <View style={styles.table}>
            {items.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.cell}>{item.description || ''}</Text>
                <Text style={styles.cell}>{item.quantity ?? 0}</Text>
                <Text style={styles.cell}>R$ {(item.unitPrice ?? 0).toFixed(2)}</Text>
                <Text style={styles.cell}>R$ {((item.quantity ?? 0) * (item.unitPrice ?? 0)).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

        {data.observations && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Observations:</Text>
            <Text>{data.observations}</Text>
          </View>
        )}
      </Page>
    </Document>
  )

  const blob = await pdf(doc).toBlob()
  return blob
}
