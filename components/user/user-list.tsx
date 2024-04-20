import { getUsers } from '@/actions/user'
import { getRoles } from '@/actions/roles'
import UserCard from '@/components/user/user-card'
import UserTitle from '@/components/user/user-title'

export default async function UserList() {
  const users = await getUsers()
  const roles = await getRoles()

  return (
    <section className="my-4">
      <UserTitle roles={roles} />
      {users.map((user) => (
        <UserCard user={user} roles={roles} key={user.id} />
      ))}
    </section>
  )
}
