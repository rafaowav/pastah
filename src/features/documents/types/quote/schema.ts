import { z } from 'zod'

export const quoteSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  clientId: z.string().uuid('Please select a client').optional(),
  clientDocument: z.string().optional().default(''),
  clientName: z.string().optional().default(''),
  clientEmail: z.string().optional().default(''),
  clientPhone: z.string().optional().default(''),
  companyId: z.string().uuid('Please select a company').optional(),
  companyDocument: z.string().optional().default(''),
  companyName: z.string().optional().default(''),
  companyEmail: z.string().optional().default(''),
  companyPhone: z.string().optional().default(''),
  companyWebsite: z.string().optional().default(''),
  items: z.array(z.object({
    productId: z.string().uuid(),
    description: z.string(),
    quantity: z.coerce.number().min(1),
    unitPrice: z.coerce.number().min(0),
  })).min(1, 'At least one item is required'),
  observations: z.string().optional(),
  validUntil: z.coerce.date().optional(),
})

export type QuoteInput = z.infer<typeof quoteSchema>
