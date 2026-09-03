'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, BellOff, CheckCheck, FileText, Building2, Users, Sparkles } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { getNotificationsAction, markAllNotificationsReadAction } from '@/features/notifications/actions'
import { NotificationItem } from '@/features/notifications/types'

const typeIcons: Record<string, typeof FileText> = {
  welcome: Sparkles,
  company: Building2,
  client: Users,
  document: FileText,
}

export function NotificationsBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await getNotificationsAction()
    if (res.success) {
      setNotifications(res.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const unreadCount = notifications.filter((n) => !n.readAt).length

  async function handleMarkAllRead() {
    const res = await markAllNotificationsReadAction()
    if (res.success) {
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })))
    }
  }

  function handleNavigate(href?: string | null) {
    if (href) {
      router.push(href)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notificações"
          />
        }
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-blue-600 text-white text-[9px] font-bold rounded-full ring-2 ring-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 rounded-2xl p-2 card-shadow" align="end">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="text-sm font-semibold text-foreground p-0">
            Notificações
          </DropdownMenuLabel>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Marcar todas como lidas
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="my-1" />

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-border border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center mb-2">
              <BellOff className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Nenhuma notificação nova</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = typeIcons[n.type] || FileText
              return (
                <button
                  key={n.id}
                  onClick={() => handleNavigate(n.href)}
                  className={`w-full text-left rounded-xl mb-0.5 px-2 py-2 cursor-pointer hover:bg-accent transition-colors ${
                    !n.readAt ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      n.type === 'company' ? 'bg-amber-50 text-amber-600'
                      : n.type === 'client' ? 'bg-indigo-50 text-indigo-600'
                      : n.type === 'welcome' ? 'bg-purple-50 text-purple-600'
                      : 'bg-blue-50 text-blue-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${n.readAt ? 'text-muted-foreground' : 'font-semibold text-foreground'}`}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}