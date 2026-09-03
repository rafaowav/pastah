'use server'

import { DashboardData } from './types'
import { getDashboardData } from './queries'
import { requireAuth } from '@/lib/auth/helpers'

export type DashboardActionState =
  | { success: true; data: DashboardData }
  | { success: false; error: string }

export async function loadDashboardAction(): Promise<DashboardActionState> {
  try {
    await requireAuth()
    const data = await getDashboardData()
    return { success: true, data }
  } catch (error) {
    console.error('Load dashboard error:', error)
    return { success: false, error: 'Erro ao carregar painel' }
  }
}