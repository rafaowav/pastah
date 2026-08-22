# Pastah Architecture

## Overview

Pastah uses **Feature-Based Architecture** with focus on:
- Server-First (RSC + Server Actions)
- Type Safety (TypeScript + Zod)
- Predictability (consistent patterns for AI)
- Composability (small, reusable components)

## Principles

1. **Server-First**: 90% of logic runs on the server
2. **Colocation**: code close to where it's used
3. **Type Safety**: TypeScript + Zod everywhere
4. **Predictability**: consistent patterns for AI
5. **Composability**: small, reusable components
6. **Security by Default**: validation, auth, and authorization in every Server Action

## Folder Structure

### `src/app/`
Routes and layouts. Only routes, layouts, and pages. Business logic goes in `features/`.

### `src/components/`
Reusable UI components (shadcn/ui, layout, forms, providers).

### `src/features/`
Business logic by feature. Each feature contains:
- `components/`: Specific components
- `actions.ts`: Server Actions
- `schema.ts`: Zod schemas
- `types.ts`: TypeScript types
- `utils/`: Utility functions

### `src/lib/`
Infrastructure and global utilities:
- `db/`: Drizzle ORM
- `auth/`: Authentication
- `pdf/`: Document Engine
- `validators/`: Shared Zod schemas
- `utils/`: Utility functions

### `src/config/`
Centralized configurations (site, navigation, features).

### `src/types/`
Global types and shared types.

## Code Patterns

### Server Actions

```typescript
'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { schema } from './schema'

export async function createDocumentAction(input: unknown) {
  const user = await auth()
  if (!user) return { error: 'Unauthorized' }

  const parsed = schema.safeParse(input)
  if (!parsed.success) return { errors: parsed.error.flatten() }

  const document = await db.documents.create({
    ...parsed.data,
    userId: user.id
  })

  return { success: true, data: document }
}
```

### Components

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schema } from './schema'

export function DocumentForm() {
  const form = useForm({
    resolver: zodResolver(schema)
  })

  return <form>{/* fields */}</form>
}
```

## Document Engine

The Document Engine is the heart of Pastah. Each document has:
- `config.ts`: Configuration
- `schema.ts`: Zod schema
- `fields.tsx`: Form
- `template.tsx`: Preview/PDF

Adding a new document takes <1 hour.

## Security

- Zod validation in all Server Actions
- Authentication on all protected routes
- Authorization (ownership) on all queries
- HTTPS + CSP headers in production

---

## Final Validation

After completing all tasks above, validate:

1. ✅ Folder structure created correctly
2. ✅ shadcn/ui configured and components installed
3. ✅ Drizzle ORM configured with scripts in package.json
4. ✅ Next.js 15 configured with App Router
5. ✅ Tailwind CSS configured with alias `@/*`
6. ✅ TypeScript configured with paths
7. ✅ Base layout with ThemeProvider and Toaster
8. ✅ Utilities and constants created
9. ✅ Configurations (site, navigation, features) created
10. ✅ Global types defined
11. ✅ ESLint and Prettier configured
12. ✅ README and documentation created

## DO NOT Implement

- Real authentication (only placeholders)
- Business features (CRUDs)
- Complete Document Engine (only structure)
- PDF generation (only folder)

## Next Step After This Setup

Implement authentication and basic CRUDs following the established patterns.