import { z } from 'zod'
import { ComponentType } from 'react'
import { LucideIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

export interface DocumentFieldsProps {
  form: UseFormReturn<any>
  clients: any[]
  companies: any[]
  products: any[]
}

export interface DocumentDefinition {
  id: string
  name: string
  description: string
  icon: LucideIcon
  schema: z.ZodTypeAny
  fields: ComponentType<DocumentFieldsProps>
  template: ComponentType<{ data: any }>
  pdf?: ComponentType<{ data: any }>
  actions: {
    canEdit: boolean
    canDelete: boolean
    canShare: boolean
    canExportPdf: boolean
  }
  config: {
    requiresClient: boolean
    requiresProducts: boolean
    requiresCompany: boolean
    maxItems?: number
  }
}
