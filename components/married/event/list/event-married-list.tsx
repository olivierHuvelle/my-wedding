import { getEvents } from '@/actions/event'
import EventTitle from '@/components/event/event-title'
import EventMarriedCard from '@/components/married/event/list/event-married-card'

export default async function EventMarriedList() {
  const events = await getEvents()
  return (
    <section className="my-4">
      <EventTitle />
      {events.map((event) => (
        <EventMarriedCard event={event} key={event.id} />
      ))}
    </section>
  )
}
