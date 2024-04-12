import { auth } from '@/utils/auth'
import EventList from '@/components/event/event-list'
import GuestList from '@/components/guest/guest-list'

export default async function GuestPage() {
  const session = await auth()

  return (
    <div>
      <EventList />
      {session?.user.id && <GuestList userId={session.user.id} />}
    </div>
  )
}
