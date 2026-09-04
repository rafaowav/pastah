import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required'),
  sku: z.string().optional(),
  category: z.string().optional(),
  settings: z.object({
    taxable: z.boolean().optional(),
    stock: z.number().optional(),
  }).optional(),
})

export type ProductInput = z.infer<typeof productSchema>

export interface Product {
  id: string
  userId: string
  name: string
  description?: string | null
  price: string
  sku?: string | null
  category?: string | null
  settings?: {
    taxable?: boolean
    stock?: number
  } | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
