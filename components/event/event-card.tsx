'use client'

import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardBody, CardFooter, Divider, Button, useDisclosure } from '@nextui-org/react'
import { FaLocationArrow } from 'react-icons/fa6'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { FaRegClock } from 'react-icons/fa6'
import EventForm from '@/components/event/event-form'
import DeleteModal from '@/components/ui/delete-modal'
import { Event } from '@prisma/client'
import { RoleCategories } from '@/utils/paths'
import { deleteEvent } from '@/actions/event'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const session = useSession()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onOpenChange: onEditOpenChange } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

  const roleConditionalRendering = () => {
    if (session.data?.user.roleCategory === RoleCategories.Married) {
      return (
        <>
          <Divider />
          <CardFooter className="flex flex-row justify-end">
            <Button onClick={onEditModalOpen} variant="flat" color="warning" className="mx-2">
              Modifier
            </Button>
            <Button onClick={onDeleteModalOpen} variant="flat" color="danger">
              Supprimer
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
          <div className="flex w-full flex-row justify-between">
            <div className="flex items-center">
              <FaRegCalendarCheck className="mr-2 text-2xl" />
              <div className="text-md">{event.name}</div>
            </div>
            <div className="flex items-center">
              <p>
                {event.startingAt
                  .toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\//g, '/')}
              </p>
            </div>
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
      <EventForm event={event} onOpenChange={onEditOpenChange} isOpen={isEditModalOpen} />

      <DeleteModal
        title="Supprimer un événement"
        confirmationText={`Etes-vous certains de vouloir supprimer l'événement ${event.name} ?`}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteOpenChange}
        deleteFn={deleteEvent}
        modelInstance={event}
      />
    </>
  )
}
