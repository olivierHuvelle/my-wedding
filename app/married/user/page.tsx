import UserList from '@/components/user/user-list'
import Breadcrumb from '@/components/ui/breadcrumb'
import paths from '@/utils/paths'

export default function UserPage() {
  return (
    <main className="my-4 w-full md:w-auto md:min-w-96">
      <Breadcrumb links={[paths.married, paths.users]} />
      <UserList />
    </main>
  )
}
