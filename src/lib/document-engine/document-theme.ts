/**
 * Tema visual compartilhado por TODOS os documentos (preview A4 e PDF).
 *
 * Referência visual: cabeçalho do Orçamento — fundo azul-marinho escuro,
 * empresa à esquerda, identificação do documento à direita, corpo branco.
 *
 * As cores aqui são fixas (não usam tokens da aplicação) porque os documentos
 * são impressos/exportados e NÃO devem depender do modo claro/escuro do app.
 */

/** Paleta compartilhada — espelha o padrão do Orçamento */
export const documentColors = {
  /** Azul-marinho escuro do cabeçalho e destaques */
  headerBg: '#0f172a',
  headerAccent: '#3b82f6',
  headerText: '#ffffff',
  headerMuted: '#cbd5e1',

  /** Corpo (branco, alto contraste para impressão) */
  bodyBg: '#ffffff',
  text: '#0f172a',
  textStrong: '#1e293b',
  textMuted: '#64748b',
  textFaint: '#94a3b8',

  /** Bordas e fundos claros do corpo */
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  divider: '#f1f5f9',
  cardBg: '#f8fafc',

  /** Semânticas */
  positive: '#059669',
  negative: '#e11d48',

  /** Títulos de seção no corpo (azul-marinho) */
  sectionTitle: '#0f172a',
} as const

/** Tipografia compartilhada (PDF em pt; preview usa classes equivalentes) */
export const documentTypography = {
  fontFamily: 'Helvetica',
  /** Tamanho base do corpo */
  body: 9,
  /** Títulos de seção do corpo */
  sectionTitle: 10,
  /** Nome do documento no cabeçalho */
  docTitle: 18,
  /** Nome da empresa no cabeçalho */
  companyName: 16,
  /** Textos auxiliares do cabeçalho */
  headerMeta: 8,
  /** Valor total destacado */
  totalValue: 16,
} as const

/** Espaçamentos compartilhados (PDF em pt; preview usa classes Tailwind equivalentes) */
export const documentSpacing = {
  pagePadding: 40,
  headerPaddingX: 40,
  headerPaddingY: 30,
  sectionGap: 24,
  blockGap: 16,
  cardPadding: 12,
  tableRowPaddingY: 8,
  footerGap: 40,
} as const

/** Layout compartilhado */
export const documentLayout = {
  pageSize: 'A4' as const,
  /** Largura da pré-visualização em px (usada pelo DocumentStudio) */
  previewWidthPx: 794,
  previewHeightPx: 1123,
  /** Raio de borda dos cards */
  cardRadius: 10,
  /** Largura padrão da linha de assinatura */
  signatureLineWidth: 240,
} as const

/**
 * Estilos base de PDF derivados do tema. Importado pelos pdf.tsx de cada
 * documento para eliminar repetição de valores.
 */
export const documentPdfBaseStyles = {
  page: {
    fontFamily: documentTypography.fontFamily,
    fontSize: documentTypography.body,
    color: documentColors.text,
  },
  header: {
    backgroundColor: documentColors.headerBg,
  },
  logo: {
    backgroundColor: documentColors.headerAccent,
    color: documentColors.headerText,
  },
  companyMeta: {
    color: documentColors.headerMuted,
  },
  docTitle: {
    color: documentColors.headerText,
  },
  docMeta: {
    color: documentColors.headerMuted,
  },
  sectionTitle: {
    color: documentColors.sectionTitle,
  },
  muted: {
    color: documentColors.textMuted,
  },
  faint: {
    color: documentColors.textFaint,
  },
  card: {
    backgroundColor: documentColors.cardBg,
  },
  total: {
    color: documentColors.text,
  },
  negative: {
    color: documentColors.negative,
  },
} as const
