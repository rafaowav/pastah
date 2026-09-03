import { z } from 'zod'

export const propostaSchema = z.object({
  title: z.string().min(3, 'Título do projeto é obrigatório'),
  companyId: z.string().uuid('Selecione uma empresa'),
  clientId: z.string().uuid('Selecione um cliente'),
  clientName: z.string().optional(),
  clientDocument: z.string().optional(),
  companyName: z.string().optional(),
  companyDocument: z.string().optional(),
  validUntil: z.coerce.date().optional(),
  introduction: z.string().min(10, 'Apresentação é obrigatória'),
  objectives: z.string().min(3, 'Objetivos do projeto é obrigatório'),
  scope: z.array(
    z.object({
      title: z.string().min(1, 'Título da fase é obrigatório'),
      description: z.string().min(3, 'Descrição da fase é obrigatória'),
      deliverables: z.string().min(3, 'Entregáveis da fase é obrigatório'),
    })
  ).min(1, 'Adicione pelo menos uma fase do projeto'),
  timeline: z.array(
    z.object({
      phase: z.string().min(1, 'Fase é obrigatória'),
      duration: z.string().min(1, 'Duração é obrigatória'),
      milestone: z.string().optional(),
    })
  ).optional(),
  investment: z.array(
    z.object({
      item: z.string().min(1, 'Item é obrigatório'),
      amount: z.coerce.number().min(0, 'Valor deve ser maior que zero'),
      condition: z.string().optional(),
    })
  ).optional(),
  terms: z.string().optional(),
})

export type PropostaInput = z.infer<typeof propostaSchema>