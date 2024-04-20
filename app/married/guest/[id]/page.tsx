import { notFound } from 'next/navigation'
import GuestList from '@/components/guest/guest-list'
import Breadcrumb from '@/components/ui/breadcrumb'
import paths from '@/utils/paths'

interface Params {
  id: string
}
export default async function MarriedGuestPage({ params }: { params: Params }) {
  if (!params || !params.id || isNaN(parseInt(params.id))) {
    notFound()
  }

  const userId = parseInt(params.id)
  const currentPath = { ...paths.marriedGuest }
  currentPath.url = `${currentPath.url}${userId}`
  currentPath.text = `${currentPath.text} : utilisateur ${userId}`

  return (
    <main>
      <Breadcrumb links={[paths.married, paths.users, currentPath]} />
      <GuestList userId={userId} />
    </main>
  )
}
