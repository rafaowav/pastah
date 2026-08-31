'use server'

import { db } from '@/lib/db'
import { documents } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { generatePdf } from './generator'

export async function generateDocumentPdfAction(documentId: string) {
  try {
    const user = await requireAuth()

    const doc = await db.query.documents.findFirst({
      where: and(
        eq(documents.id, documentId),
        eq(documents.userId, user.id),
        isNull(documents.deletedAt)
      ),
    })

    if (!doc) {
      return { success: false, error: 'Document not found' }
    }

    const blob = await generatePdf({
      title: doc.title,
      type: doc.type,
      ...doc.data,
    })
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return {
      success: true,
      data: {
        base64,
        filename: `${doc.type}-${doc.id}.pdf`,
      },
    }
  } catch (error) {
    console.error('Generate PDF error:', error)
    return { success: false, error: 'Something went wrong' }
  }
}
