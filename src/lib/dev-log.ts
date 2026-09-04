const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Log técnico apenas em desenvolvimento. Nunca imprime segredos
 * (senhas, tokens, headers de auth): passe apenas o contexto necessário.
 */
export function devLog(scope: string, message: string, meta?: unknown) {
  if (IS_DEV) {
    console.warn(`[pastah:dev][${scope}] ${message}`, meta ?? '')
  }
}

export function devError(scope: string, error: unknown) {
  if (IS_DEV) {
    console.error(`[pastah:dev][${scope}]`, error)
  }
}

/**
 * Extrai o campo `name` de um payload desconhecido com segurança,
 * para uso em logs de desenvolvimento.
 */
export function extractName(input: unknown): string | undefined {
  if (typeof input === 'object' && input !== null && 'name' in input) {
    const name = (input as { name?: unknown }).name
    return typeof name === 'string' ? name : undefined
  }
  return undefined
}

/**
 * Converte um erro desconhecido em mensagem amigável em pt-BR,
 * detectando erros comuns do Postgres/Drizzle.
 */
export function friendlyDbError(error: unknown): string {
  const err = error as { code?: string; message?: string; constraint?: string } | null
  const code = err?.code
  if (code === '23503') return 'Registro referenciado não existe (verifique empresa/cliente selecionado).'
  if (code === '23505') return 'Registro duplicado.'
  if (code === '23514') return 'Dados inválidos: verifique os valores informados.'
  if (code === '22P02') return 'Identificador inválido.'
  if (code === '22001') return 'Valor muito longo para o campo.'
  if (code === '22008') return 'Data inválida.'
  if (code === '42703') return 'Coluna inexistente — rode as migrations do banco (npm run db:migrate).'
  if (code === '42P01') return 'Tabela inexistente — rode as migrations do banco (npm run db:migrate).'
  if (err?.message?.includes('fetch failed') || err?.message?.includes('ECONNREFUSED')) {
    return 'Falha de conexão com o banco de dados.'
  }
  return 'Ocorreu um erro inesperado ao salvar. Tente novamente.'
}
