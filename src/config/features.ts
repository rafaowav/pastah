export const featuresConfig = {
  documents: {
    enabled: true,
    maxPerUser: 1000,
    allowedTypes: ["orcamento", "proposta", "recibo"],
  },
  clients: {
    enabled: true,
    maxPerUser: 500,
  },
  companies: {
    enabled: true,
    maxPerUser: 10,
  },
  products: {
    enabled: true,
    maxPerUser: 1000,
  },
  templates: {
    enabled: true,
    maxPerUser: 100,
  },
}
