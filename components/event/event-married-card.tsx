'use client'

import { Button, CardFooter, Divider, Link, useDisclosure } from '@nextui-org/react'
import DeleteModal from '@/components/ui/delete-modal'
import { deleteEvent } from '@/actions/event'
import EventCard from '@/components/event/event-card'
import { Event } from '@prisma/client'
import paths from '@/utils/paths'

interface EventMarriedCardProps {
  event: Event
}

export default function EventMarriedCard({ event }: EventMarriedCardProps) {
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()
  return (
    <EventCard event={event}>
      <>
        <Divider />
        <CardFooter className="flex flex-row justify-end">
          <Button onClick={onDeleteModalOpen} variant="flat" color="danger" className="mx-2">
            Supprimer
          </Button>
          <Button href={`${paths.event.url}${event.id}`} as={Link} variant="flat" color="primary">
            Voir
          </Button>
        </CardFooter>
      </>
      <DeleteModal
        title="Supprimer un événement"
        confirmationText={`Etes-vous certain de vouloir supprimer l'événement ${event.name} ?`}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteOpenChange}
        deleteFn={deleteEvent}
        modelInstance={event}
      />
    </EventCard>
  )
}
