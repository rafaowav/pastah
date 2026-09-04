'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { companySchema, CompanyInput, CompanyParsed } from '../types'
import { createCompanyAction, updateCompanyAction } from '../actions'
import { Building2, CheckCircle2, Mail, Phone, MapPin, Loader2 } from 'lucide-react'

interface CompanyFormProps {
  mode: 'create' | 'edit'
  initialData?: CompanyInput & { id?: string }
}

export function CompanyForm({ mode, initialData }: CompanyFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<CompanyInput, unknown, CompanyParsed>({
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

  async function onSubmit(data: CompanyParsed) {
    if (isSaving) return
    setIsSaving(true)

    try {
      const result =
        mode === 'create'
          ? await createCompanyAction(data)
          : await updateCompanyAction(initialData!.id!, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Empresa cadastrada com sucesso!' : 'Empresa atualizada!')
        router.push('/companies')
        router.refresh()
      } else {
        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            for (const message of messages) {
              toast.error(`${field}: ${message}`)
            }
          }
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[company-form] erro inesperado:', error)
      }
      toast.error('Não foi possível salvar a empresa. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = 'h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent'
  const errorClass = 'text-xs font-medium text-destructive mt-1'

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-6">
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
              disabled={isSaving}
              aria-invalid={!!form.formState.errors.name}
              className={inputClass}
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className={errorClass}>{form.formState.errors.name.message}</p>
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
                disabled={isSaving}
                className={inputClass}
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
                disabled={isSaving}
                className={inputClass}
                {...form.register('website')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" /> E-mail Comercial
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@empresa.com"
                disabled={isSaving}
                aria-invalid={!!form.formState.errors.email}
                className={inputClass}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className={errorClass}>{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" /> Telefone Comercial
              </Label>
              <Input
                id="phone"
                placeholder="(11) 3333-0000"
                disabled={isSaving}
                className={inputClass}
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
              disabled={isSaving}
              className={inputClass}
              {...form.register('address.street')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Número</Label>
            <Input
              placeholder="1000"
              disabled={isSaving}
              className={inputClass}
              {...form.register('address.number')}
            />
          </div>

          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Bairro</Label>
            <Input
              placeholder="Bela Vista"
              disabled={isSaving}
              className={inputClass}
              {...form.register('address.neighborhood')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Cidade</Label>
            <Input
              placeholder="São Paulo"
              disabled={isSaving}
              className={inputClass}
              {...form.register('address.city')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Estado (UF)</Label>
            <Input
              placeholder="SP"
              disabled={isSaving}
              className={inputClass}
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
          disabled={isSaving}
          className="rounded-xl h-11 px-6 font-medium text-xs border-border hover:bg-accent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          aria-busy={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSaving ? 'Salvando...' : mode === 'create' ? 'Cadastrar Empresa' : 'Salvar Alterações'}
          {!isSaving && <CheckCircle2 className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  )
}
