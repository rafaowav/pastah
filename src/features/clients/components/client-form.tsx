'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { clientSchema, ClientInput } from '../types'
import { createClientAction, updateClientAction } from '../actions'
import { Users, CheckCircle2, MapPin, Mail, Phone } from 'lucide-react'

interface ClientFormProps {
  mode: 'create' | 'edit'
  initialData?: ClientInput & { id?: string }
}

export function ClientForm({ mode, initialData }: ClientFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ClientInput>({
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

  async function onSubmit(data: ClientInput) {
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
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`)
            })
          })
        } else {
          toast.error(result.error as string)
        }
      }
    } catch (error) {
      toast.error('Erro ao salvar cliente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Dados Principais</h3>
            <p className="text-xs text-slate-500">Nome e documentos de identificação do cliente</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
              Nome Completo / Razão Social *
            </Label>
            <Input
              id="name"
              placeholder="Ex: Ana Silva ou Tech Solutions Ltda"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600 font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document" className="text-xs font-semibold text-slate-700">
                CPF / CNPJ
              </Label>
              <Input
                id="document"
                placeholder="000.000.000-00"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('document')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="cliente@email.com"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                Telefone / WhatsApp
              </Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                disabled={isLoading}
                className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
                {...form.register('phone')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 main-container-shadow border border-slate-200/80 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">Endereço de Faturamento</h3>
            <p className="text-xs text-slate-500">Opcional para exibição no cabeçalho de orçamentos e faturas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-8 space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Logradouro</Label>
            <Input
              placeholder="Rua / Avenida"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('address.street')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Número</Label>
            <Input
              placeholder="123"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('address.number')}
            />
          </div>

          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Bairro</Label>
            <Input
              placeholder="Centro"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('address.neighborhood')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Cidade</Label>
            <Input
              placeholder="São Paulo"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
              {...form.register('address.city')}
            />
          </div>
          <div className="sm:col-span-4 space-y-2">
            <Label className="text-xs font-semibold text-slate-700">Estado (UF)</Label>
            <Input
              placeholder="SP"
              disabled={isLoading}
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200 text-sm focus:bg-white"
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
          className="rounded-xl h-11 px-6 font-medium text-xs border-slate-300 hover:bg-slate-50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 px-8 font-semibold text-xs shadow-md gap-2"
        >
          {isLoading ? 'Salvando...' : mode === 'create' ? 'Cadastrar Cliente' : 'Salvar Alterações'}
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
