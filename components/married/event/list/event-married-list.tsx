import { getEvents } from '@/actions/event'
import EventMarriedCard from '@/components/married/event/list/event-married-card'

export default async function EventMarriedList() {
  const events = await getEvents()
  return (
    <section className="my-4">
      <h2 className="text-2xl">Evénements</h2>
      {events.map((event) => (
        <EventMarriedCard event={event} key={event.id} />
      ))}
    </section>
  )
}
