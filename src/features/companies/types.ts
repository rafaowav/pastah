import { z } from 'zod'

/**
 * Campo de texto opcional: transforma '' em undefined para o Postgres
 * receber NULL em vez de string vazia.
 */
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

export const companySchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  document: optionalText,
  email: z
    .union([z.literal(''), z.string().email('E-mail inválido')])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  phone: optionalText,
  website: optionalText,
  address: optionalAddress,
  settings: z
    .object({
      logo: optionalText,
      primaryColor: optionalText,
      secondaryColor: optionalText,
    })
    .optional()
    .transform((v) => (v && Object.values(v).some(Boolean) ? v : undefined)),
})

export type CompanyInput = z.input<typeof companySchema>
export type CompanyParsed = z.output<typeof companySchema>

export interface Company {
  id: string
  userId: string
  name: string
  document?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
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
  settings?: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  } | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}
