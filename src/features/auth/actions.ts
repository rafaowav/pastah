'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export async function registerUserAction(formData: { name: string; email: string; password: string }) {
  try {
    const parsed = registerSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos' }
    }

    const { name, email, password } = parsed.data

    const existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.email, email.toLowerCase()),
    })

    if (existingUser) {
      return { success: false, error: 'Este e-mail já está cadastrado.' }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const [newUser] = await db.insert(users).values({
      name,
      email: email.toLowerCase(),
      passwordHash,
    }).returning()

    return { success: true, data: { id: newUser.id, email: newUser.email } }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Erro ao criar conta. Tente novamente.' }
  }
}
