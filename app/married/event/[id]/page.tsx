import { notFound } from 'next/navigation'
import { getEvent, getEvents } from '@/actions/event'
import EventForm from '@/components/married/event/single/event-form'
import ContactCard from '@/components/contact/contact-card'
import ContactEmptyCard from '@/components/contact/contact-empty-card'
import ContactTile from '@/components/contact/contact-title'
import { Contact, Guest } from '@prisma/client'
import GuestSummary from '@/components/married/event/single/guest/guest-summary'
import { getGuests } from '@/actions/guest'
import GuestEventCard from '@/components/married/event/single/guest/guest-event-card'
import Breadcrumb from '@/components/ui/breadcrumb'
import paths from '@/utils/paths'

export interface ContactWithEvents {
  contact: Contact
  events: number[]
}

export interface GuestWithEvents {
  guest: Guest
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

  const currentPath = { ...paths.event }
  currentPath.url = `${currentPath.url}${event.id}`
  currentPath.text = `${currentPath.text} : ${event.name}`
  const guests = await getGuests()
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
  contactsWithEvents.sort((a, b) => a.contact.id - b.contact.id)

  return (
    <main className="my-4 w-full md:w-auto md:min-w-96">
      <Breadcrumb links={[paths.married, currentPath]} />
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

      <section className="my-4">
        <h2 className="flex w-full flex-row justify-between px-4 text-2xl md:px-0">Invités</h2>
        <div className="w-full rounded  md:w-auto md:min-w-96">
          <GuestSummary guests={event.guests.map((guest) => guest.guest)} />
          {guests.map((guest) => (
            <GuestEventCard guest={guest} event={event} key={guest.id} />
          ))}
        </div>
      </section>
    </main>
  )
}
