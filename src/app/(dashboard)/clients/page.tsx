import { getClientsAction } from '@/features/clients/actions'
import { ClientListClient } from '@/features/clients/components/client-list-client'

export default async function ClientsPage() {
  const result = await getClientsAction()
  const clients = result.success ? result.data : []

  return <ClientListClient initialClients={clients} />
}
