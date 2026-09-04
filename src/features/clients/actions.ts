'use server'

import { db } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import { clientSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/features/notifications/actions'
import { ActionState, zodFieldErrors } from '@/lib/action-result'
import { devLog, devError, friendlyDbError, extractName } from '@/lib/dev-log'
import type { Client } from './types'

function revalidateClientPaths(id?: string) {
  revalidatePath('/clients')
  revalidatePath('/dashboard')
  if (id) revalidatePath(`/clients/${id}`)
}

export async function createClientAction(input: unknown): Promise<ActionState<Client>> {
  try {
    const user = await requireAuth()
    devLog('clients.create', 'payload recebido', { name: extractName(input) })

    const parsed = clientSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const [client] = await db
      .insert(clients)
      .values({
        userId: user.id,
        name: parsed.data.name,
        email: parsed.data.email || null,
        document: parsed.data.document || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address ?? null,
      })
      .returning()

    await createNotification(
      user.id,
      null,
      'client',
      'Cliente criado',
      `O cliente "${client.name}" foi cadastrado com sucesso.`,
      '/clients',
    )

    revalidateClientPaths(client.id)
    return { success: true, data: client }
  } catch (error) {
    devError('clients.create', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getClientsAction(): Promise<ActionState<Client[]>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.clients.findMany({
      where: and(eq(clients.userId, user.id), isNull(clients.deletedAt)),
      orderBy: (clients, { desc }) => [desc(clients.createdAt)],
    })
    return { success: true, data: rows }
  } catch (error) {
    devError('clients.list', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getClientByIdAction(id: string): Promise<ActionState<Client>> {
  try {
    const user = await requireAuth()
    const client = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })
    if (!client) return { success: false, error: 'Cliente não encontrado.' }
    return { success: true, data: client }
  } catch (error) {
    devError('clients.get', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateClientAction(id: string, input: unknown): Promise<ActionState<Client>> {
  try {
    const user = await requireAuth()
    devLog('clients.update', 'payload recebido', { id, name: extractName(input) })

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return { success: false, error: 'Identificador de cliente inválido.' }
    }

    const parsed = clientSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const existing = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Cliente não encontrado.' }

    const [updated] = await db
      .update(clients)
      .set({
        name: parsed.data.name,
        email: parsed.data.email || null,
        document: parsed.data.document || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))
      .returning()

    revalidateClientPaths(id)
    return { success: true, data: updated }
  } catch (error) {
    devError('clients.update', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function deleteClientAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.clients.findFirst({
      where: and(eq(clients.id, id), eq(clients.userId, user.id), isNull(clients.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Cliente não encontrado.' }

    await db
      .update(clients)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(clients.id, id), eq(clients.userId, user.id)))

    revalidateClientPaths()
    return { success: true, data: undefined }
  } catch (error) {
    devError('clients.delete', error)
    return { success: false, error: friendlyDbError(error) }
  }
}
