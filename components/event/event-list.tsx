import { getEvents } from '@/actions/event'
import EventCard from '@/components/event/event-card'

export default async function EventList() {
  const events = await getEvents()
  return (
    <section className="my-4">
      <h2 className="text-2xl">Evénements</h2>
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </section>
  )
}
