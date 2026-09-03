import { z } from 'zod'

export const contractSchema = z.object({
  contractTitle: z.string().min(3, 'Título do contrato é obrigatório'),
  companyId: z.string().uuid('Selecione uma empresa'),
  clientId: z.string().uuid('Selecione um cliente'),
  contractorRepresentative: z.object({
    name: z.string().min(2, 'Nome do representante é obrigatório'),
    cpf: z.string().optional(),
    role: z.string().optional(),
  }),
  clientRepresentative: z.object({
    name: z.string().min(2, 'Nome do representante é obrigatório'),
    cpf: z.string().optional(),
    role: z.string().optional(),
  }),
  clauses: z.object({
    clause1Object: z.string().min(3, 'Cláusula do objeto é obrigatória'),
    clause2ObligationsContractor: z.string().min(3, 'Obrigações da contratada é obrigatória'),
    clause3ObligationsClient: z.string().min(3, 'Obrigações do contratante é obrigatória'),
    clause4Payment: z.string().min(3, 'Cláusula de preço e pagamento é obrigatória'),
    clause5DurationTermination: z.string().min(3, 'Cláusula de vigência e rescisão é obrigatória'),
    clause6Jurisdiction: z.string().min(3, 'Cláusula de foro de eleição é obrigatória'),
  }),
  witnesses: z.array(
    z.object({
      name: z.string().min(1, 'Nome da testemunha é obrigatório'),
      cpf: z.string().optional(),
    })
  ).optional(),
})

export type ContractInput = z.infer<typeof contractSchema>