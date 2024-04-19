import { notFound } from 'next/navigation'
import { getEvent, getEvents } from '@/actions/event'
import EventForm from '@/components/married/event/single/event-form'
import ContactCard from '@/components/contact/contact-card'
import ContactEmptyCard from '@/components/contact/contact-empty-card'
import ContactTile from '@/components/contact/contact-title'
import { Contact } from '@prisma/client'

export interface ContactWithEvents {
  contact: Contact
  events: number[]
}

export default async function EventSinglePage({ params }: { params: { id: string } }) {
  const events = await getEvents()
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const event = await getEvent(id)
  if (!event) {
    notFound()
  }

  const contactsWithEvents: ContactWithEvents[] = []

  event.contacts.forEach(({ contactId, eventId, contact }) => {
    const existingContactIndex = contactsWithEvents.findIndex((item) => item.contact.id === contactId)
    if (existingContactIndex === -1) {
      contactsWithEvents.push({
        contact,
        events: contact.events.map((contactEvent) => contactEvent.eventId),
      })
    } else {
      contactsWithEvents[existingContactIndex].events.push(eventId)
    }
  })

  return (
    <main className="my-4 w-full md:w-auto md:min-w-96">
      <section>
        <h2 className="mb-2 text-2xl">{event.name}</h2>
        <div className="w-full rounded bg-white p-4 md:w-auto md:min-w-96">
          <EventForm event={event} />
        </div>
      </section>

      <section className="my-4">
        <ContactTile events={events} />
        <div className="w-full rounded  md:w-auto md:min-w-96">
          {contactsWithEvents.length > 0 &&
            contactsWithEvents.map((contactWithEvents) => (
              <ContactCard contactWithEvents={contactWithEvents} key={contactWithEvents.contact.id} events={events} />
            ))}
          {event.contacts.length === 0 && <ContactEmptyCard />}
        </div>
      </section>
    </main>
  )
}
