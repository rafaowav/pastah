'use server'

import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { productSchema, ProductInput } from './types'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export type ActionState<T> = 
  | { success: true; data: T }
  | { success: false; error: string; errors?: Record<string, string[]> }

export async function createProductAction(input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = productSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const [product] = await db.insert(products).values({
      userId: user.id,
      ...parsed.data,
    }).returning()

    revalidatePath('/products')
    return { success: true, data: product }
  } catch (error) {
    console.error('Create product error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getProductsAction(): Promise<ActionState<any[]>> {
  try {
    const user = await requireAuth()
    const userProducts = await db.query.products.findMany({
      where: and(eq(products.userId, user.id), isNull(products.deletedAt)),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    })
    return { success: true, data: userProducts }
  } catch (error) {
    console.error('Get products error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function getProductByIdAction(id: string): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })
    if (!product) return { success: false, error: 'Product not found' }
    return { success: true, data: product }
  } catch (error) {
    console.error('Get product error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function updateProductAction(id: string, input: unknown): Promise<ActionState<any>> {
  try {
    const user = await requireAuth()
    const parsed = productSchema.safeParse(input)
    
    if (!parsed.success) {
      return { success: false, error: 'Validation failed', errors: parsed.error.flatten().fieldErrors }
    }

    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Product not found' }

    const [updated] = await db.update(products)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.userId, user.id)))
      .returning()

    revalidatePath('/products')
    revalidatePath(`/products/${id}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Update product error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}

export async function deleteProductAction(id: string): Promise<ActionState<void>> {
  try {
    const user = await requireAuth()
    const existing = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.userId, user.id), isNull(products.deletedAt)),
    })

    if (!existing) return { success: false, error: 'Product not found' }

    await db.update(products)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(products.id, id), eq(products.userId, user.id)))

    revalidatePath('/products')
    return { success: true, data: undefined }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
