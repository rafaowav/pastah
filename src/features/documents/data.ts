import { documents } from '@/lib/db/schema'

export type DocumentRow = typeof documents.$inferSelect

export interface DocumentWithRelations extends DocumentRow {
  relatedDocuments?: {
    relationId: string
    relationType: string
    direction: 'source' | 'target'
    document: {
      id: string
      type: string
      title: string
      status: string
      totalAmount: number
    }
  }[]
}
