'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { companySchema, CompanyInput } from '../types'
import { createCompanyAction, updateCompanyAction } from '../actions'
import { Building2, CheckCircle2, Globe, Mail, Phone, MapPin } from 'lucide-react'

interface CompanyFormProps {
  mode: 'create' | 'edit'
  initialData?: CompanyInput & { id?: string }
}

export function CompanyForm({ mode, initialData }: CompanyFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: initialData || {
      name: '',
      document: '',
      email: '',
      phone: '',
      website: '',
      address: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
      },
      settings: {},
    },
  })

  async function onSubmit(data: CompanyInput) {
    setIsLoading(true)

    try {
      const result = mode === 'create'
        ? await createCompanyAction(data)
        : await updateCompanyAction(initialData!.id!, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Empresa cadastrada com sucesso!' : 'Empresa atualizada!')
        router.push('/companies')
        router.refresh()
      } else {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`)
            })
          })
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      toast.error('Erro ao salvar empresa.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-muted pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Identificação da Empresa</h3>
            <p className="text-xs text-muted-foreground">Dados do emissor que figuram no cabeçalho e rodapé dos documentos</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Razão Social / Nome Fantasia *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Pastah Soluções Criativas Ltda"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-xs font-semibold text-foreground">
                CNPJ / CPF
              </Label>
              <Input
                id="document"
                placeholder="00.000.000/0001-00"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('document')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-xs font-semibold text-foreground">
                Website / Portfólio
              </Label>
              <Input
                id="website"
                placeholder="https://suaempresa.com"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('website')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                E-mail Comercial
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                Telefone Comercial
              </Label>
              <Input
                id="phone"
                placeholder="(11) 3333-0000"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('phone')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-muted pb-4">
          <div className="w-10 h-10 rounded-xl bg-muted text-foreground flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Endereço da Sede</h3>
            <p className="text-xs text-muted-foreground">Dados de localização impressos no documento</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Logradouro</Label>
            <Input
              placeholder="Avenida Paulista"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.street')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Número</Label>
            <Input
              placeholder="1000"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.number')}
            />
          </div>

          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Bairro</Label>
            <Input
              placeholder="Bela Vista"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.neighborhood')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Cidade</Label>
            <Input
              placeholder="São Paulo"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.city')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Estado (UF)</Label>
            <Input
              placeholder="SP"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.state')}
            />
          </div>
        </div>
      </div>

      {/* Submit Controls */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/companies')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-border hover:bg-accent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Cadastrar Empresa' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
