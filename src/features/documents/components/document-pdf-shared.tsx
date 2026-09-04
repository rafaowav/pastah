/**
 * Componentes de PDF compartilhados (padrão visual do Orçamento).
 * Usados pelos pdf.tsx de cada tipo de documento com @react-pdf/renderer.
 */
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import {
  documentColors,
  documentTypography,
  documentSpacing,
  documentLayout,
} from '@/lib/document-engine/document-theme'

// ---------------------------------------------------------------------------
// Estilos base compartilhados
// ---------------------------------------------------------------------------

export const docPdfStyles = StyleSheet.create({
  page: {
    fontFamily: documentTypography.fontFamily,
    fontSize: documentTypography.body,
    color: documentColors.text,
    padding: documentSpacing.pagePadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: documentColors.headerBg,
    marginTop: -documentSpacing.pagePadding,
    marginLeft: -documentSpacing.pagePadding,
    marginRight: -documentSpacing.pagePadding,
    paddingHorizontal: documentSpacing.headerPaddingX,
    paddingVertical: documentSpacing.headerPaddingY,
  },
  companyBlock: { flexDirection: 'column', gap: 2 },
  companyTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  companyLogo: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: documentColors.headerAccent,
    color: documentColors.headerText,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  companyName: {
    color: documentColors.headerText,
    fontSize: documentTypography.companyName,
    fontWeight: 'bold',
  },
  companyMeta: { color: documentColors.headerMuted, fontSize: documentTypography.headerMeta },
  docTitle: {
    color: documentColors.headerText,
    fontSize: documentTypography.docTitle,
    fontWeight: 'bold',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  docMeta: { color: documentColors.headerMuted, fontSize: documentTypography.headerMeta, textAlign: 'right' },

  clientCard: {
    marginTop: documentSpacing.sectionGap,
    border: `1px solid ${documentColors.border}`,
    borderRadius: documentLayout.cardRadius,
    padding: 16,
  },
  clientLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: documentColors.textFaint,
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: documentColors.text,
    marginBottom: 4,
  },
  clientRow: { flexDirection: 'row', gap: 16 },
  clientField: { fontSize: 8, color: documentColors.textMuted },

  sectionTitle: {
    fontSize: documentTypography.sectionTitle,
    fontWeight: 'bold',
    color: documentColors.sectionTitle,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: { fontSize: 9, color: '#475569', marginBottom: 4, lineHeight: 1.4 },

  tableHead: {
    flexDirection: 'row',
    borderBottom: `2px solid ${documentColors.border}`,
    paddingVertical: documentSpacing.tableRowPaddingY,
  },
  th: {
    fontSize: 7,
    fontWeight: 'bold',
    color: documentColors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: `1px solid ${documentColors.divider}`,
    paddingVertical: documentSpacing.tableRowPaddingY,
    wrap: false,
  },
  td: { fontSize: 9 },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  summaryText: { fontSize: 9, color: '#475569' },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: `2px solid ${documentColors.headerBg}`,
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  totalValue: {
    fontSize: documentTypography.totalValue,
    fontWeight: 'bold',
    color: documentColors.text,
  },

  infoCard: {
    flex: 1,
    backgroundColor: documentColors.cardBg,
    borderRadius: 8,
    padding: 10,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: documentColors.textFaint,
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  infoValue: { fontSize: 9, fontWeight: 'medium', color: documentColors.textStrong },

  footer: {
    marginTop: documentSpacing.footerGap,
    borderTop: `1px solid ${documentColors.border}`,
    paddingTop: 24,
    alignItems: 'center',
  },
  footerHint: { fontSize: 8, color: documentColors.textMuted, marginBottom: 24 },
  footerMeta: {
    fontSize: 7,
    color: documentColors.textFaint,
    marginTop: 20,
    textAlign: 'center',
  },
  signatureLine: {
    width: documentLayout.signatureLineWidth,
    borderTop: `1px solid ${documentColors.borderStrong}`,
    paddingTop: 4,
  },
  signatureName: { fontSize: 8, fontWeight: 'bold', color: '#334155' },
})

// ---------------------------------------------------------------------------
// Formatação
// ---------------------------------------------------------------------------

export function pdfBRL(value: number): string {
  return (Number.isFinite(value) ? value : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function pdfDate(value: unknown): string {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(String(value))
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR')
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface PdfCompany {
  name?: string
  document?: string
  email?: string
  phone?: string
  address?: {
    city?: string
    state?: string
  } | null
  [key: string]: unknown
}

export interface PdfHeaderInfo {
  title: string
  number?: string
  issuedAt?: unknown
  validUntil?: unknown
  validLabel?: string
  status?: string
  extraLines?: string[]
}

// ---------------------------------------------------------------------------
// Cabeçalho azul-marinho
// ---------------------------------------------------------------------------

export function DocumentPdfHeader({
  company,
  info,
}: {
  company?: PdfCompany | null
  info: PdfHeaderInfo
}) {
  const name = company?.name || 'Sua Empresa'
  const initial = (name?.[0] || 'P').toUpperCase()
  const addressLine =
    company?.address && (company.address.city || company.address.state)
      ? [company.address.city, company.address.state].filter(Boolean).join(' - ')
      : null

  return (
    <View style={docPdfStyles.header} fixed>
      <View style={docPdfStyles.companyBlock}>
        <View style={docPdfStyles.companyTitleRow}>
          <Text style={docPdfStyles.companyLogo}>{initial}</Text>
          <Text style={docPdfStyles.companyName}>{name}</Text>
        </View>
        {company?.document && <Text style={docPdfStyles.companyMeta}>CNPJ: {company.document}</Text>}
        {company?.email && <Text style={docPdfStyles.companyMeta}>{company.email}</Text>}
        {company?.phone && <Text style={docPdfStyles.companyMeta}>{company.phone}</Text>}
        {addressLine && <Text style={docPdfStyles.companyMeta}>{addressLine}</Text>}
      </View>
      <View>
        <Text style={docPdfStyles.docTitle}>{info.title}</Text>
        {info.number && <Text style={docPdfStyles.docMeta}>Nº {String(info.number)}</Text>}
        <Text style={docPdfStyles.docMeta}>Emissão: {pdfDate(info.issuedAt ?? new Date())}</Text>
        {Boolean(info.validLabel || info.validUntil) && (
          <Text style={docPdfStyles.docMeta}>
            Validade: {info.validLabel ? String(info.validLabel) : pdfDate(info.validUntil)}
          </Text>
        )}
        {info.status && <Text style={docPdfStyles.docMeta}>Status: {String(info.status)}</Text>}
        {info.extraLines?.map((line, i) => (
          <Text key={i} style={docPdfStyles.docMeta}>
            {String(line)}
          </Text>
        ))}
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Bloco de cliente
// ---------------------------------------------------------------------------

export function DocumentPdfClient({
  client,
  fallbackName,
  title = 'Cliente',
}: {
  client?: PdfCompany | null
  fallbackName?: string
  title?: string
}) {
  const name = client?.name || fallbackName || 'Nome do Cliente'
  return (
    <View style={docPdfStyles.clientCard}>
      <Text style={docPdfStyles.clientLabel}>{title}</Text>
      <Text style={docPdfStyles.clientName}>{name}</Text>
      <View style={docPdfStyles.clientRow}>
        {client?.document && <Text style={docPdfStyles.clientField}>CPF/CNPJ: {client.document}</Text>}
        {client?.email && <Text style={docPdfStyles.clientField}>{client.email}</Text>}
        {client?.phone && <Text style={docPdfStyles.clientField}>{client.phone}</Text>}
      </View>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Rodapé
// ---------------------------------------------------------------------------

export function DocumentPdfFooter({
  company,
  info,
  hint,
  signatureName,
  signatures,
  children,
}: {
  company?: PdfCompany | null
  info?: PdfHeaderInfo
  hint?: string
  signatureName?: string
  signatures?: { label: string; name?: string }[]
  children?: React.ReactNode
}) {
  const contact = [company?.email, company?.phone].filter(Boolean).join(' • ')
  const issued = pdfDate(info?.issuedAt ?? new Date())

  return (
    <View style={docPdfStyles.footer} fixed>
      {children}
      {signatures && signatures.length > 0 ? (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 40 }}>
          {signatures.map((sig, i) => (
            <View key={i} style={{ alignItems: 'center', minWidth: 160 }}>
              <View style={docPdfStyles.signatureLine}>
                <Text style={docPdfStyles.signatureName}>{sig.name || ' '}</Text>
              </View>
              <Text style={{ fontSize: 7, color: documentColors.textFaint, marginTop: 2 }}>{sig.label}</Text>
            </View>
          ))}
        </View>
      ) : (
        signatureName !== undefined && (
          <View style={{ alignItems: 'center' }}>
            {hint && <Text style={docPdfStyles.footerHint}>{hint}</Text>}
            <View style={docPdfStyles.signatureLine}>
              <Text style={docPdfStyles.signatureName}>{signatureName}</Text>
            </View>
          </View>
        )
      )}
      <Text style={docPdfStyles.footerMeta}>
        {company?.name || 'Sua Empresa'}
        {contact ? ` • ${contact}` : ''}
        {info?.number ? ` • Doc. ${info.number}` : ''} • Emitido em {issued}
      </Text>
    </View>
  )
}

// ---------------------------------------------------------------------------
// Página padrão
// ---------------------------------------------------------------------------

export function DocumentPdfPage({
  children,
  style,
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any
}) {
  return (
    <Page size={documentLayout.pageSize} style={[docPdfStyles.page, style]}>
      {children}
    </Page>
  )
}

export { documentColors, documentTypography, documentSpacing, documentLayout }
