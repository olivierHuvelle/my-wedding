import { getGuestsForUserId } from '@/actions/guest'
import { getEvents } from '@/actions/event'
import GuestCard from '@/components/guest/guest-card'
import GuestTitle from '@/components/guest/guest-title'

interface GuestListProps {
  userId: number
}

export default async function GuestList({ userId }: GuestListProps) {
  const guests = await getGuestsForUserId(userId)
  const events = await getEvents()

  return (
    <section className="my-4">
      <GuestTitle userId={userId} events={events} />
      {guests.map((guest) => (
        <GuestCard guest={guest} key={guest.id} events={events} />
      ))}
    </section>
  )
}
