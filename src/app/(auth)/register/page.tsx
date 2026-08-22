/**
 * Página de Cadastro
 * Rota: /register
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Criar Conta</h2>
        <p className="text-muted-foreground">Registre-se para começar a criar documentos profissionais.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nome completo</label>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

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
              minLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar senha</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirme sua senha"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  )
}