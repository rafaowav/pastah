# Pastah - Workspace de Documentos

Um workspace de documentos para profissionais, freelancers, MEIs e pequenas empresas criarem documentos profissionais rapidamente.

## Stack

- Next.js 16+
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Drizzle ORM
- React Hook Form
- Zod
- next-themes
- Lucide React
- clsx, tailwind-merge

## Arquitetura

### Feature-Based Architecture

O projeto segue uma arquitetura baseada em features, onde cada módulo de negócio tem sua própria pasta com:

- `actions.ts` - Server Actions
- `schema.ts` - Zod validações
- `types.ts` - TypeScript interfaces
- `components/` - Componentes UI
- `utils/` - Utilitários específicos
- `actions.ts` - Ações específicas

Pastas principais:

```
src/
├── app/          # App Router (rotas)
├── components/   # Componentes reutilizáveis
├── features/     # Feature-Based Architecture
├── lib/          # Infraestrutura e utilitários
├── config/       # Configurações
└── types/        # Tipos globais
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Start
npm start

# Lint
npm run lint

# Banco de dados
npm run db:generate   # Gerar migrations
npm run db:migrate    # Rodar migrations
npm run db:push       # Empurrar mudanças
npm run db:studio     # Abrir Drizzle Studio
```

## Configurações

### Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/pastah"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### shadcn/ui

- Style: base-nova
- Base color: neutral (zinc)
- CSS variables: habilitado
- Import alias: `@/*` → `./src/*`

### Drizzle ORM

- Schema: `src/lib/db/schema/index.ts`
- Migrations: `src/lib/db/migrations/`
- Config: `drizzle.config.ts`

## Licença

MIT