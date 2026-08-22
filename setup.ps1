$base = "D:/Rafao/projetos dev/2k26/pastah"
cd $base

# 1. Setup src directory and move existing
New-Item -ItemType Directory -Force -Path src | Out-Null
if (Test-Path app) { Move-Item -Path app -Destination src -Force }
if (Test-Path components) { Move-Item -Path components -Destination src -Force }
if (Test-Path lib) { Move-Item -Path lib -Destination src -Force }

# Fix utils.ts conflict if it exists
if (Test-Path src/lib/utils.ts) {
    $tempUtils = Get-Content src/lib/utils.ts
    Remove-Item src/lib/utils.ts
    New-Item -ItemType Directory -Force -Path src/lib/utils | Out-Null
    Set-Content -Path src/lib/utils/index.ts -Value $tempUtils
}

# 2. Create required folders
$folders = @(
    "src/app/(auth)/login",
    "src/app/(auth)/register",
    "src/app/(dashboard)/documents",
    "src/app/(dashboard)/clients",
    "src/app/(dashboard)/companies",
    "src/app/(dashboard)/products",
    "src/app/(dashboard)/templates",
    "src/app/(dashboard)/settings",
    "src/app/api/webhooks",
    "src/app/api/share",
    "src/components/ui",
    "src/components/layout",
    "src/components/forms",
    "src/components/providers",
    "src/features/auth/components",
    "src/features/auth/hooks",
    "src/features/documents/components",
    "src/features/documents/utils",
    "src/features/clients",
    "src/features/companies",
    "src/features/products",
    "src/features/templates",
    "src/features/settings",
    "src/lib/db/schema",
    "src/lib/auth",
    "src/lib/pdf",
    "src/lib/validators",
    "src/lib/utils",
    "src/config",
    "src/types"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

# 3. Create Files

# App files
if (-not (Test-Path "src/app/(dashboard)/layout.tsx")) {
    Set-Content -Path "src/app/(dashboard)/layout.tsx" -Value "export default function DashboardLayout({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }"
}

# Feature files
$features = @("auth", "documents", "clients", "companies", "products", "templates", "settings")
foreach ($feature in $features) {
    Set-Content -Path "src/features/$feature/README.md" -Value "# Módulo: $feature`n`nEste diretório contém componentes, ações, schemas e utilitários da feature de $feature."
}

# Feature auth files
Set-Content -Path "src/features/auth/actions.ts" -Value "// Server Actions para auth"
Set-Content -Path "src/features/auth/schema.ts" -Value "// Zod Schemas para auth"
Set-Content -Path "src/features/auth/types.ts" -Value "// Types e Interfaces para auth"

# Feature documents files
Set-Content -Path "src/features/documents/actions.ts" -Value "// Server Actions para documents"
Set-Content -Path "src/features/documents/schema.ts" -Value "// Zod Schemas para documents"
Set-Content -Path "src/features/documents/types.ts" -Value "// Types e Interfaces para documents"

# lib/db files
Set-Content -Path "src/lib/db/schema/README.md" -Value "# Schemas do Drizzle ORM`n`nDefine as tabelas e relações do banco de dados PostgreSQL."
Set-Content -Path "src/lib/db/index.ts" -Value "// Configuração da conexão com o banco de dados (Drizzle)"
Set-Content -Path "src/lib/db/migrate.ts" -Value "// Script para rodar as migrations do banco"
Set-Content -Path "src/lib/constants.ts" -Value "// Constantes globais da aplicação"

# config files
Set-Content -Path "src/config/site.ts" -Value "// Configurações gerais do site (SEO, links, etc)"
Set-Content -Path "src/config/navigation.ts" -Value "// Definição da navegação (menus, links laterais)"
Set-Content -Path "src/config/features.ts" -Value "// Feature flags ou configurações de módulos"

# types files
Set-Content -Path "src/types/index.ts" -Value "// Tipagens compartilhadas da aplicação"
Set-Content -Path "src/types/actions.ts" -Value "// Tipagens para retornos das Server Actions"
