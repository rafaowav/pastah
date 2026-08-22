import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Package,
  FileStack,
  Settings,
} from "lucide-react"

export const navigation = {
  main: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Documentos",
      href: "/documents",
      icon: FileText,
    },
    {
      title: "Clientes",
      href: "/clients",
      icon: Users,
    },
    {
      title: "Empresas",
      href: "/companies",
      icon: Building2,
    },
    {
      title: "Produtos",
      href: "/products",
      icon: Package,
    },
    {
      title: "Templates",
      href: "/templates",
      icon: FileStack,
    },
  ],
  secondary: [
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ],
}
