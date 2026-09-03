import { z } from 'zod'

export const orcamentoSchema = z.object({
  title: z.string().min(3, 'Título do orçamento é obrigatório'),
  companyId: z.string().uuid('Selecione uma empresa'),
  clientId: z.string().uuid('Selecione um cliente'),
  validUntil: z.coerce.date().optional(),
  paymentTerms: z.enum(['PIX à vista', '50/50', 'Cartão até 12x', 'Boleto 30 dias']).optional(),
  deliveryTime: z.string().optional(),
  observations: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().uuid().optional(),
    description: z.string().min(1, 'Descrição do produto é obrigatória'),
    quantity: z.coerce.number().min(1, 'Quantidade mínima é 1'),
    unitPrice: z.coerce.number().min(0, 'Preço unitário deve ser maior que zero'),
    discountPercent: z.coerce.number().min(0).max(100).default(0),
  })).min(1, 'Adicione pelo menos um item').max(50),
  descontoTotal: z.coerce.number().default(0),
})

export type OrcamentoInput = z.infer<typeof orcamentoSchema>