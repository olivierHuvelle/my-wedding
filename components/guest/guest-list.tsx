import { getGuestsForUserId } from '@/actions/guest'
import GuestCard from '@/components/guest/guest-card'

interface GuestListProps {
  userId: number
}
export default async function GuestList({ userId }: GuestListProps) {
  const guests = await getGuestsForUserId(userId)
  return (
    <section>
      <h2 className="text-2xl">Invités</h2>
      {guests.map((guest) => (
        <GuestCard guest={guest} key={guest.id} />
      ))}
    </section>
  )
}
