'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, useDisclosure } from '@nextui-org/react'
import { FaLocationArrow } from 'react-icons/fa6'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { FaRegClock } from 'react-icons/fa6'
import EventForm from '@/components/event/event-form'
import { Event } from '@prisma/client'
import { RoleCategories } from '@/utils/paths'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const session = useSession()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const roleConditionalRendering = () => {
    if (session.data?.user.roleCategory === RoleCategories.Married) {
      return (
        <>
          <Divider />
          <CardFooter className="flex flex-row justify-end">
            <Button onClick={onOpen} variant="flat" color="warning">
              Modifier
            </Button>
          </CardFooter>
        </>
      )
    }
    return null
  }

  return (
    <>
      <Card className="my-2 cursor-pointer">
        <CardHeader className="flex gap-3">
          <div className="flex">
            <FaRegCalendarCheck className="mr-2 text-2xl" />
            <div className="text-md">{event.name}</div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-row justify-between">
            <FaLocationArrow className="text-2xl" />
            <p>
              {event.number} {event.street}, {event.zipCode} {event.city}
            </p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full flex-row justify-between">
            <FaRegClock className="text-2xl" />
            <p>
              {event.startingAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
              -
              {event.endingAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
            </p>
          </div>
        </CardFooter>
        {roleConditionalRendering()}
      </Card>
      <EventForm event={event} onOpenChange={onOpenChange} isOpen={isOpen} />
    </>
  )
}
