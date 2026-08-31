'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowRight, Lock, Mail, User, CheckCircle2 } from 'lucide-react'
import { registerUserAction } from '@/features/auth/actions'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !password) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    if (password !== passwordConfirm) {
      toast.error('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setIsLoading(true)
    try {
      const res = await registerUserAction({ name, email, password })

      if (!res.success) {
        toast.error(res.error)
        setIsLoading(false)
        return
      }

      toast.success('Conta criada com sucesso! Conectando...')

      // Automatic sign-in after registration
      const loginRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (loginRes?.error) {
        router.push('/login')
      } else {
        router.push('/documents')
        router.refresh()
      }
    } catch (error) {
      toast.error('Erro ao realizar cadastro.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-[460px] space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <span className="font-bold text-xl tracking-tighter">P</span>
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">
              Pastah<span className="text-blue-600">.</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-slate-900 pt-2">Crie sua Conta Gratuita</h1>
          <p className="text-sm text-slate-500">Comece a gerar documentos profissionais em poucos segundos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 main-container-shadow border border-slate-200/80 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Nome Completo
              </Label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome ou razão social"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                E-mail Profissional
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 6 dígitos"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="passwordConfirm" className="text-xs font-semibold text-slate-700">
                  Confirmar
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="passwordConfirm"
                    type="password"
                    placeholder="Repita a senha"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all gap-2 mt-2"
            >
              {isLoading ? 'Criando conta...' : (
                <>
                  Criar Minha Conta <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Já possui uma conta?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}