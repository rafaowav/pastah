'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { ArrowRight, Lock, Mail, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos.')
      return
    }

    setIsLoading(true)
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error('E-mail ou senha incorretos.')
      } else {
        toast.success('Bem-vindo de volta!')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao entrar. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-[420px] space-y-6">
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
          <h1 className="font-heading text-2xl font-bold text-slate-900 pt-2">Acesse seu Workspace</h1>
          <p className="text-sm text-slate-500">Entre com suas credenciais para gerenciar documentos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 main-container-shadow border border-slate-200/80 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Senha
                </Label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-slate-50/50 border-slate-200 focus:bg-white text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md transition-all gap-2 mt-2"
            >
              {isLoading ? 'Entrando...' : (
                <>
                  Entrar no Workspace <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Não tem uma conta?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}