/**
 * Componentes de cliente/info/rodapé de preview (re-exportados por conveniência).
 * O conteúdo principal vive em document-header.tsx para manter um único
 * ponto de verdade do padrão visual.
 */
export {
  DocumentHeader,
  DocumentClientInfo,
  DocumentSectionTitle,
  DocumentSectionHeading,
  DocumentFooter,
  formatDocBRL,
  formatDocDate,
} from './document-header'
export type {
  DocumentHeaderProps,
  DocumentClientInfoProps,
  DocumentFooterProps,
  DocumentHeaderInfo,
  DocCompany,
  DocClient,
} from './document-header'
