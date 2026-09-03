'use server'

import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull, isNotNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { NotificationsActionState, NotificationItem } from './types'

export async function getNotificationsAction(): Promise<NotificationsActionState<NotificationItem[]>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.notifications.findMany({
      where: eq(notifications.userId, user.id),
      orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
      limit: 20,
    })
    return { success: true, data: rows.map((r) => ({
      id: r.id,
      companyId: r.companyId,
      type: r.type as any,
      title: r.title,
      message: r.message,
      href: r.href,
      readAt: r.readAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    })) }
  } catch (error) {
    console.error('Get notifications error:', error)
    return { success: false, error: 'Erro ao carregar notificações' }
  }
}

export async function markAllNotificationsReadAction(): Promise<NotificationsActionState<void>> {
  try {
    const user = await requireAuth()
    await db.update(notifications)
      .set({ readAt: new Date() })
      .where(and(eq(notifications.userId, user.id), isNull(notifications.readAt)))
    revalidatePath('/')
    revalidatePath('/dashboard')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Mark all read error:', error)
    return { success: false, error: 'Erro ao marcar notificações como lidas' }
  }
}

export async function getUnreadCountAction(): Promise<NotificationsActionState<number>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.notifications.findMany({
      where: and(eq(notifications.userId, user.id), isNull(notifications.readAt)),
      columns: { id: true },
    })
    return { success: true, data: rows.length }
  } catch (error) {
    console.error('Get unread count error:', error)
    return { success: false, error: 'Erro' }
  }
}

// Internal helper — not a server action, called from other server actions
export async function createNotification(
  userId: string,
  companyId: string | null | undefined,
  type: string,
  title: string,
  message: string,
  href?: string,
) {
  const existing = await db.query.notifications.findFirst({
    where: and(
      eq(notifications.userId, userId),
      eq(notifications.type, type),
      eq(notifications.title, title),
      isNull(notifications.readAt),
    ),
  })
  if (existing) return
  await db.insert(notifications).values({
    userId,
    companyId: companyId ?? null,
    type,
    title,
    message,
    href: href ?? null,
  }).execute()
}