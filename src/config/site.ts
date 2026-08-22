export const siteConfig = {
  name: "Pastah",
  description: "Workspace de Documentos",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.jpg",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
  },
  keywords: ["documentos", "orcamentos", "propostas", "freelancer", "MEI"],
}

export type SiteConfig = typeof siteConfig
