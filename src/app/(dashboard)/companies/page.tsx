import { getCompaniesAction } from '@/features/companies/actions'
import { CompanyListClient } from '@/features/companies/components/company-list-client'

export default async function CompaniesPage() {
  const result = await getCompaniesAction()
  const companies = result.success ? result.data : []

  return <CompanyListClient initialCompanies={companies} />
}
