'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { clientSchema, ClientInput, ClientParsed } from '../types'
import { createClientAction, updateClientAction } from '../actions'
import { Users, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react'

interface ClientFormProps {
  mode: 'create' | 'edit'
  initialData?: ClientInput & { id?: string }
}

export function ClientForm({ mode, initialData }: ClientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientInput, unknown, ClientParsed>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialData || {
      name: '',
      document: '',
      email: '',
      phone: '',
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
    },
  })

  async function onSubmit(data: ClientParsed) {
    if (isLoading) return
    setIsLoading(true)

    try {
      const result = mode === 'create'
        ? await createClientAction(data)
        : await updateClientAction(initialData!.id!, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Cliente cadastrado com sucesso!' : 'Cliente atualizado!')
        router.push('/clients')
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
        console.error('[client-form] erro inesperado:', error)
      }
      toast.error('Não foi possível salvar o cliente. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-card rounded-3xl p-6 sm:p-8 main-container-shadow border border-border/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-muted pb-4">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-foreground">Dados Principais</h3>
            <p className="text-xs text-muted-foreground">Nome e documentos de identificação do cliente</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Nome Completo / Razão Social *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Ana Silva ou Tech Solutions Ltda"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-xs font-semibold text-foreground">
                CPF / CNPJ
              </Label>
              <Input
                id="document"
                placeholder="000.000.000-00"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('document')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                disabled={isLoading}
                className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
                {...form.register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                Telefone / WhatsApp
              </Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
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
            <h3 className="font-heading font-bold text-lg text-foreground">Endereço de Faturamento</h3>
            <p className="text-xs text-muted-foreground">Opcional para exibição no cabeçalho de orçamentos e faturas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Logradouro</Label>
            <Input
              placeholder="Rua / Avenida"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.street')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Número</Label>
            <Input
              placeholder="123"
              disabled={isLoading}
              className="h-11 rounded-xl bg-muted border-border text-sm focus:bg-transparent"
              {...form.register('address.number')}
            />
          </div>

          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-foreground">Bairro</Label>
            <Input
              placeholder="Centro"
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
          onClick={() => router.push('/clients')}
          className="rounded-xl h-11 px-6 font-medium text-xs border-border hover:bg-accent"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
