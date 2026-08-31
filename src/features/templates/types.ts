import { z } from 'zod'

export const templateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  documentType: z.string().min(1, 'Document type is required'),
  config: z.record(z.string(), z.any()).optional(),
  isGlobal: z.string().optional(),
})

export type TemplateInput = z.infer<typeof templateSchema>

export interface Template {
  id: string
  userId: string
  documentType: string
  name: string
  config: Record<string, any>
  isGlobal?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
