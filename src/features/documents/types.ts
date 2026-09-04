import { z } from 'zod'

const uuidField = z.string().uuid('Identificador inválido')

export const documentSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  companyId: uuidField.nullish().or(z.literal('').transform(() => undefined)),
  clientId: uuidField.nullish().or(z.literal('').transform(() => undefined)),
  status: z.string().optional(),
  data: z.record(z.string(), z.any()),
  templateId: uuidField.nullish().or(z.literal('').transform(() => undefined)),
  isFavorite: z.string().optional(),
  /**
   * IDs de documentos a vincular (ex: orçamento de origem de um recibo).
   * Validado no servidor: ownership, auto-relação e duplicidade.
   */
  relatedDocumentIds: z.array(uuidField).max(10).optional(),
  relationType: z
    .enum(['recibo_de', 'gerado_a_partir_de', 'vinculado_a', 'substitui'])
    .optional(),
})

export type DocumentInput = z.infer<typeof documentSchema>
