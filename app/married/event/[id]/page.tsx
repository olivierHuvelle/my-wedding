import { notFound } from 'next/navigation'
import { getEvent } from '@/actions/event'
import EventForm from '@/components/married/event/single/event-form'

export default async function EventSinglePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const event = await getEvent(id)
  if (!event) {
    notFound()
  }

  return (
    <>
      <section className="my-4 w-full md:w-auto md:min-w-96">
        <h2 className="mb-2 text-2xl">{event.name}</h2>
        <div className="w-full rounded bg-white p-4 md:w-auto md:min-w-96">
          <EventForm event={event} />
        </div>
      </section>
    </>
  )
}
