import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  document: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  settings: z.object({
    logo: z.string().optional(),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
  }).optional(),
})

export type CompanyInput = z.infer<typeof companySchema>

export interface Company {
  id: string
  userId: string
  name: string
  document?: string
  email?: string
  phone?: string
  website?: string
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  settings?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}