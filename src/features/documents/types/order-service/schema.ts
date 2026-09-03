import { z } from 'zod'

export const orderServiceSchema = z.object({
  osNumber: z.string().min(1, 'Número da OS é obrigatório'),
  companyId: z.string().uuid('Selecione uma empresa'),
  clientId: z.string().uuid('Selecione um cliente'),
  entryDate: z.coerce.date().default(new Date()),
  expectedDate: z.coerce.date().optional(),
  technician: z.string().optional(),
  equipment: z.object({
    name: z.string().min(1, 'Nome do equipamento é obrigatório'),
    brand: z.string().optional(),
    model: z.string().optional(),
    serialNumber: z.string().optional(),
    conditionNotes: z.string().optional(),
  }),
  reportedProblem: z.string().min(3, 'Descrição do defeito é obrigatória'),
  technicalDiagnosis: z.string().optional(),
  services: z.array(
    z.object({
      description: z.string().optional(),
      hours: z.coerce.number().min(0, 'Horas devem ser maior ou igual a 0').default(0),
      laborRate: z.coerce.number().min(0, 'Taxa de mão de obra deve ser maior que zero').default(0),
      total: z.coerce.number().optional(),
    })
  ).optional(),
  parts: z.array(
    z.object({
      partName: z.string().optional(),
      quantity: z.coerce.number().min(0, 'Quantidade deve ser maior que zero').default(1),
      unitPrice: z.coerce.number().min(0, 'Preço unitário deve ser maior que zero').default(0),
      total: z.coerce.number().optional(),
    })
  ).optional(),
  status: z.string().default('Aberta'),
  warrantyTerms: z.string().optional(),
})

export type OrderServiceInput = z.infer<typeof orderServiceSchema>