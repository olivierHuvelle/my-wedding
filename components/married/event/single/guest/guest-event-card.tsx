'use client'

import { Card, CardBody } from '@nextui-org/react'
import { Event, EventGuest, Guest } from '@prisma/client'

interface GuestEventCardProps {
  guest: Guest & {
    events: (EventGuest & { event: Event })[]
  }
  event: Event
}

export default function GuestEventCard({ guest, event }: GuestEventCardProps) {
  const ageConditionalRendering = () => {
    if (!guest.isChild) {
      return 'Adulte'
    } else {
      return `Enfant - ${guest.age}`
    }
  }
  const badgeBackgroundRendering = () => {
    const containsEventId = guest.events.some((guestEvent) => guestEvent.eventId === event.id)
    return containsEventId ? 'bg-green-400' : 'bg-red-400'
  }

  return (
    <>
      <Card className="my-2 w-full">
        <CardBody className="relative text-center">
          <div className={`absolute right-1 top-1 h-3 w-3 rounded-full ${badgeBackgroundRendering()}`}></div>
          <p>
            {guest.firstName} {guest.lastName} | menu : {guest.menu} | {ageConditionalRendering()}
          </p>
        </CardBody>
      </Card>
    </>
  )
}
