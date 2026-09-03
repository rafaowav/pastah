# Pastah

Workspace de documentos comerciais para profissionais, freelancers, MEIs e pequenas empresas.

Crie orçamentos, propostas, recibos, ordens de serviço e contratos com pré-visualização A4 em tempo real e exportação para PDF.

---

## Funcionalidades

- **Dashboard empresarial** por empresa ativa com KPIs, gráficos e documentos recentes.
- **Orçamentos** — itens, descontos, cálculo automático, condições de pagamento.
- **Propostas comerciais** — escopo, cronograma, investimento e termos de aceite.
- **Recibos de pagamento** — valor por extenso, forma de pagamento, quitação formal.
- **Ordens de serviço** — diagnóstico, peças, mão de obra, garantia e assinaturas.
- **Contratos de prestação de serviços** — cláusulas jurídicas, prazos e assinaturas.
- **Empresas, clientes e produtos** — cadastro e gestão completos.
- **Templates personalizados** — modelos reutilizáveis com dados padrão.
- **Pré-visualização A4** em tempo real durante a edição.
- **Exportação em PDF** diagramada e pronta para impressão/envio.
- **Tema claro, escuro e do sistema**.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js App Router |
| Linguagem | TypeScript |
| Estilos | Tailwind CSS, shadcn/ui, Base UI |
| Banco de dados | PostgreSQL |
| ORM | Drizzle ORM |
| Autenticação | Auth.js (NextAuth) |
| Formulários | React Hook Form + Zod |
| Tema | next-themes |
| Ícones | Lucide React |
| PDF | @react-pdf/renderer |

---

## Estrutura do projeto

```
src/
├── app/                    # Rotas e layouts (App Router)
│   ├── (auth)/             # Login e registro
│   ├── (dashboard)/        # Páginas protegidas
│   └── page.tsx             # Landing page pública
├── components/
│   ├── layout/             # Sidebar, Header, CommandPalette
│   ├── providers/          # ThemeProvider
│   └── ui/                 # Componentes de interface (shadcn/Base UI)
├── features/               # Módulos de negócio
│   ├── auth/               # Autenticação
│   ├── clients/            # Clientes
│   ├── companies/          # Empresas (ativa via cookie)
│   ├── dashboard/          # Dashboard com métricas e gráficos
│   ├── documents/          # Motor de documentos (5 tipos)
│   ├── notifications/      # Central de notificações
│   ├── products/           # Produtos/serviços
│   └── templates/          # Templates personalizados
├── lib/
│   ├── auth/               # Configuração Auth.js
│   ├── db/                 # Drizzle schema e migrations
│   ├── document-engine/    # Registry de tipos de documento
│   └── pdf/                # Geração de PDF
├── config/                 # Feature flags e navegação
└── types/                  # Tipos globais
```

---

## Pré-requisitos

- Node.js (versão definida no `package.json`)
- npm, pnpm ou yarn
- PostgreSQL local ou hospedado
- Variáveis de ambiente configuradas

---

## Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd pastah
npm install
cp .env.example .env.local
```

> Nunca versionar `.env` ou `.env.local`. Use `.env.example` como referência.

---

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://user:password@localhost:5432/pastah` |
| `AUTH_SECRET` | Chave secreta do Auth.js | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | URL pública da aplicação | `http://localhost:3000` |

---

## Banco de dados

```bash
npm run db:generate   # Gerar migrations
npm run db:migrate    # Aplicar migrations
npm run db:studio     # Abrir Drizzle Studio
```

---

## Desenvolvimento

```bash
npm run dev
```

URLs principais:

| Rota | Descrição |
|---|---|
| `/` | Landing page pública |
| `/login` | Entrar |
| `/register` | Criar conta |
| `/dashboard` | Dashboard protegida |
| `/documents` | Documentos |
| `/templates` | Templates |
| `/companies` | Empresas |
| `/clients` | Clientes |
| `/products` | Produtos |

---

## Qualidade e build

```bash
npx tsc --noEmit    # Verificar tipos
npm run build       # Build de produção
```

---

## Tema

O sistema suporta três modos:

- **Claro** — padrão profissional com fundo claro.
- **Escuro** — fundo azul-marinho com cards levemente mais claros.
- **Sistema** — segue a preferência do sistema operacional.

A preferência persiste entre sessões. O preview A4 e os PDFs mantêm aparência clara de impressão independentemente do tema.

---

## Segurança

- Validação Zod em todas as Server Actions.
- Autenticação e autorização por usuário.
- Isolamento de dados por empresa ativa.
- Cookies httpOnly para empresa ativa.
- Variáveis de ambiente fora do Git.
- Chaves e segredos nunca versionados.

### Segredos e Git

- **Nunca commitar** `.env` ou `.env.local`. Use `.env.example` como referência segura.
- Configurações locais de agentes (Antigravity, OpenCode, Stitch) e arquivos MCP (`mcp_config.json`, `.agents/`, `.mcp/`, `.opencode/`, `.cursor/`, `.claude/`, `.gemini/`) **não** devem ser versionadas.
- Se você criar uma configuração MCP compartilhável, use apenas a versão de exemplo `mcp_config.example.json`, sem chaves reais.
- **Chaves expostas** devem ser revogadas e recriadas imediatamente no provedor correspondente. Adicionar ao `.gitignore` não é suficiente quando o segredo já foi commitado.
- Antes de fazer `push`, execute uma verificação de segredos para garantir que nenhuma credencial, token ou URL de banco com senha esteja sendo enviada.

---

## Roadmap

- [ ] Colaboração em tempo real
- [ ] Compartilhamento público de documentos
- [ ] Assinatura digital
- [ ] Integrações financeiras (Stripe, Asaas)
- [ ] IA opcional em versão futura

---

## Licença

Privado — Todos os direitos reservados.