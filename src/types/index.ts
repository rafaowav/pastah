import { DocumentType, DocumentStatus } from "@/lib/constants"

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  userId: string
  name: string
  document?: string
  address?: Address
  settings?: CompanySettings
  createdAt: Date
  updatedAt: Date
}

export interface Client {
  id: string
  userId: string
  name: string
  email?: string
  document?: string
  phone?: string
  address?: Address
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  userId: string
  name: string
  description?: string
  price: number // em centavos
  settings?: ProductSettings
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  userId: string
  companyId?: string
  clientId?: string
  type: DocumentType
  title: string
  status: DocumentStatus
  data: Record<string, any>
  templateId?: string
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Template {
  id: string
  userId: string
  documentType: DocumentType
  name: string
  config: TemplateConfig
  isGlobal: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

export interface CompanySettings {
  logo?: string
  primaryColor?: string
  secondaryColor?: string
  email?: string
  phone?: string
  website?: string
}

export interface ProductSettings {
  category?: string
  sku?: string
  stock?: number
  taxable?: boolean
}

export interface TemplateConfig {
  fields: Record<string, any>
  layout: Record<string, any>
  styles: Record<string, any>
}

export type ActionResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string }
  | { errors: Record<string, string[]> }
