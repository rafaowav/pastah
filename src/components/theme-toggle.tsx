'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <button className="w-9 h-9 rounded-xl text-muted-foreground flex items-center justify-center" aria-label="Carregando tema">
        <Sun className="w-4 h-4" />
      </button>
    )
  }

  const isDark = resolvedTheme === 'dark'
  const currentLabel = theme === 'system' ? 'Sistema' : isDark ? 'Escuro' : 'Claro'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Tema: ${currentLabel}`}
            className="rounded-xl"
          />
        }
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-amber-400" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 rounded-2xl p-2 card-shadow" align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`rounded-xl cursor-pointer text-xs font-medium ${theme === 'light' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          Tema claro
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`rounded-xl cursor-pointer text-xs font-medium ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
        >
          <Moon className="w-4 h-4 text-amber-400" />
          Tema escuro
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`rounded-xl cursor-pointer text-xs font-medium ${theme === 'system' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
        >
          <Monitor className="w-4 h-4 text-muted-foreground" />
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}