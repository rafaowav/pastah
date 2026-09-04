'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { productSchema } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { ActionState, zodFieldErrors } from '@/lib/action-result'
import { devLog, devError, friendlyDbError, extractName } from '@/lib/dev-log'
import type { Product } from './types'

function revalidateProductPaths(id?: string) {
  revalidatePath('/products')
  revalidatePath('/dashboard')
  if (id) revalidatePath(`/products/${id}`)
}

export async function createProductAction(input: unknown): Promise<ActionState<Product>> {
  try {
    const user = await requireAuth()
    devLog('products.create', 'payload recebido', { name: extractName(input) })

    const parsed = productSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const [product] = await db
      .insert(products)
      .values({
        userId: user.id,
        name: parsed.data.name,
        description: parsed.data.description || null,
        price: parsed.data.price,
        sku: parsed.data.sku || null,
        category: parsed.data.category || null,
        settings: parsed.data.settings ?? null,
      })
      .returning()

    revalidateProductPaths(product.id)
    return { success: true, data: product }
  } catch (error) {
    devError('products.create', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getProductsAction(): Promise<ActionState<Product[]>> {
  try {
    const user = await requireAuth()
    const rows = await db.query.products.findMany({
      where: and(eq(products.userId, user.id), isNull(products.deletedAt)),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    })
    return { success: true, data: rows }
  } catch (error) {
    devError('products.list', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function getProductByIdAction(id: string): Promise<ActionState<Product>> {
  try {
    const user = await requireAuth()
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })
    if (!product) return { success: false, error: 'Produto não encontrado.' }
    return { success: true, data: product }
  } catch (error) {
    devError('products.get', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function updateProductAction(id: string, input: unknown): Promise<ActionState<Product>> {
  try {
    const user = await requireAuth()
    devLog('products.update', 'payload recebido', { id, name: extractName(input) })

    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      return { success: false, error: 'Identificador de produto inválido.' }
    }

    const parsed = productSchema.safeParse(input)
    if (!parsed.success) {
      return {
        success: false,
        error: 'Verifique os campos destacados.',
        fieldErrors: zodFieldErrors(parsed.error),
      }
    }

    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Produto não encontrado.' }

    const [updated] = await db
      .update(products)
      .set({
        name: parsed.data.name,
        description: parsed.data.description || null,
        price: parsed.data.price,
        sku: parsed.data.sku || null,
        category: parsed.data.category || null,
        settings: parsed.data.settings ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), eq(products.userId, user.id)))
      .returning()

    revalidateProductPaths(id)
    return { success: true, data: updated }
  } catch (error) {
    devError('products.update', error)
    return { success: false, error: friendlyDbError(error) }
  }
}

export async function deleteProductAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })
    if (!existing) return { success: false, error: 'Produto não encontrado.' }

    await db
      .update(products)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.userId, user.id)))

    revalidateProductPaths()
    return { success: true, data: undefined }
  } catch (error) {
    devError('products.delete', error)
    return { success: false, error: friendlyDbError(error) }
  }
}
