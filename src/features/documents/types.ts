import { z } from 'zod'

export const documentSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required'),
  companyId: z.string().optional().nullable(),
  clientId: z.string().optional().nullable(),
  status: z.string().optional(),
  data: z.record(z.string(), z.any()),
  templateId: z.string().optional().nullable(),
  isFavorite: z.string().optional(),
})

export type DocumentInput = z.infer<typeof documentSchema>
