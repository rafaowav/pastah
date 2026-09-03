'use server'

import { db } from '@/lib/db'
import { documents, companies, clients } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth/helpers'
import { eq, and, isNull } from 'drizzle-orm'
import { generateDocumentPdf } from './generator'

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

    // Enrich data with full company / client objects for the PDF components
    const [company, client] = await Promise.all([
      doc.companyId
        ? db.query.companies.findFirst({ where: eq(companies.id, doc.companyId) })
        : null,
      doc.clientId
        ? db.query.clients.findFirst({ where: eq(clients.id, doc.clientId) })
        : null,
    ])

    const blob = await generateDocumentPdf(doc.type, {
      ...doc.data,
      title: doc.title,
      type: doc.type,
      company: company || undefined,
      client: client || undefined,
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
    return { success: false, error: 'Ocorreu um erro' }
  }
}
