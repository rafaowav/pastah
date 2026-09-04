/**
 * Resultado discriminado padrão de todas as Server Actions de escrita.
 * Sucesso: { success: true, data }
 * Falha:   { success: false, error, fieldErrors? }
 */
export type ActionState<T> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      fieldErrors?: Record<string, string[]>
    }

/** Extrai fieldErrors planos do ZodError (compatível com zod v3 e v4). */
export function zodFieldErrors(error: {
  issues: readonly { path: PropertyKey[]; message: string }[]
}): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = issue.path.map(String).join('.') || '_root'
    if (!out[key]) out[key] = []
    out[key].push(issue.message)
  }
  return out
}
