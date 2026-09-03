'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { clientSchema, ClientInput } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'

export type ActionState<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function createClientAction(input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = clientSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const [client] = await db.insert(clients).values({
      userId: user.id,
      ...parsed.data,
    }).returning()

    await createNotification(
      user.id,
      null,
      'client',
      'Cliente criado',
      `O cliente "${client.name}" foi cadastrado com sucesso.`,
      '/clients',
    )

    revalidatePath('/clients')
    return { success: true, data: client }
  } catch (error) {
    console.error('Create client error:', error)
    return { success: false, error: 'Ocorreu um erro' }
  }
}

export async function getClientsAction(): Promise<ActionState<any[]>> {
  try {
    const user = await requireAuth()
    const userClients = await db.query.clients.findMany({
      where: and(eq(clients.userId, user.id), isNull(clients.deletedAt)),
      orderBy: (clients, { desc }) => [desc(clients.createdAt)],
    })
    return { success: true, data: userClients }
  } catch (error) {
    console.error('Get clients error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getClientByIdAction(id: string): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const client = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })
    if (!client) return { success: false, error: 'Client not found' }
    return { success: true, data: client }
  } catch (error) {
    console.error('Get client error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function updateClientAction(id: string, input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = clientSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const existing = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Client not found' }

    const [updated] = await db.update(clients)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning()

    revalidatePath('/clients')
    revalidatePath(`/clients/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Update client error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function deleteClientAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Client not found' }

    await db.update(clients)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))

    revalidatePath('/clients')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete client error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
