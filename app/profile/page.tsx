import { getUser } from '@/actions/user'
import { auth } from '@/utils/auth'
import ProfileForm from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const session = await auth()
  const user = await getUser(session?.user.id as number)

  return (
    <section className="my-4">
      <h2 className="mb-2 text-2xl">Profil</h2>
      <div className="mb-4 w-full rounded bg-white px-8 pb-8 pt-6 shadow-md md:w-96">
        <ProfileForm user={user} />
      </div>
    </section>
  )
}
