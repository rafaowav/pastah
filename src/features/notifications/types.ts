export interface NotificationItem {
  id: string
  companyId: string | null
  type: 'welcome' | 'company' | 'client' | 'document' | 'system'
  title: string
  message: string
  href: string | null
  readAt: string | null
  createdAt: string
}

export type NotificationsActionState<T> =
  | { success: true; data: T }
  | { success: false; error: string }
