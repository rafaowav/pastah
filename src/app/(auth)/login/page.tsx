/**
 * Página de Login
 * Rota: /login
 */
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold">Entrar na Conta</h2>
          <p className="text-muted-foreground">Acesse sua conta para gerenciar seus documentos e clientes.</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              name="password"
              placeholder="Sua senha"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <a href="#" className="hover:underline">
            Esqueceu a senha?
          </a>
        </div>
      </div>
    </div>
  )
}