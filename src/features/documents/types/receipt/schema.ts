import { z } from 'zod'

export const receiptSchema = z.object({
  receiptNumber: z.string().min(1, 'Número do recibo é obrigatório'),
  companyId: z.string().uuid('Selecione uma empresa'),
  clientId: z.string().uuid('Selecione um cliente'),
  clientName: z.string().optional(),
  clientDocument: z.string().optional(),
  companyName: z.string().optional(),
  companyDocument: z.string().optional(),
  emissorNome: z.string().optional(),
  emissorCNPJ: z.string().optional(),
  pagadorNome: z.string().optional(),
  pagadorCPF: z.string().optional(),
  amount: z.coerce.number().min(0, 'Valor deve ser maior que zero'),
  amountInWords: z.string().optional(),
  reference: z.string().min(3, 'Descrição do pagamento é obrigatória'),
  paymentDate: z.coerce.date().optional(),
  paymentMethod: z.string().optional(),
  city: z.string().optional(),
  cityDate: z.string().optional(),
  observations: z.string().optional(),
})

export type ReceiptInput = z.infer<typeof receiptSchema>