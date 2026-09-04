import { z } from 'zod'

const optionalText = z
  .string()
  .optional()
  .transform((v) => (v === '' ? undefined : v))

const optionalAddress = z
  .object({
    street: optionalText,
    number: optionalText,
    complement: optionalText,
    neighborhood: optionalText,
    city: optionalText,
    state: optionalText,
    zipCode: optionalText,
    country: optionalText,
  })
  .optional()
  .transform((v) => {
    if (!v) return undefined
    const hasAny = Object.values(v).some((x) => typeof x === 'string' && x.length > 0)
    return hasAny ? v : undefined
  })

export const clientSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z
    .union([z.literal(''), z.string().email('E-mail inválido')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  document: optionalText,
  phone: optionalText,
  address: optionalAddress,
})

export type ClientInput = z.input<typeof clientSchema>
export type ClientParsed = z.output<typeof clientSchema>

export interface Client {
  id: string
  userId: string
  name: string
  email?: string | null
  document?: string | null
  phone?: string | null
  address?: {
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  } | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
