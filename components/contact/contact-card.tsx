'use client'

import { Button, Card, CardBody, CardFooter, Divider, useDisclosure } from '@nextui-org/react'
import { Event } from '@prisma/client'
import { ContactWithEvents } from '@/app/married/event/[id]/page'
import ContactForm from '@/components/contact/contact-form'
import { deleteContact } from '@/actions/contact'
import DeleteModal from '@/components/ui/delete-modal'

interface ContactCardProps {
  contactWithEvents: ContactWithEvents
  events: Event[]
}

export default function ContactCard({ contactWithEvents, events }: ContactCardProps) {
  const {
    isOpen: IsEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure()

  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

  const { contact } = contactWithEvents
  let deleteModalMessage = `Etes-vous certain de vouloir supprimer le contact ${contact.firstName} ${contact.lastName ?? ''} ?`
  if (contactWithEvents.events.length > 1) {
    deleteModalMessage += ` Attention ce contact est utilisé dans plusieurs événements`
  }

  return (
    <>
      <Card className="my-2 w-full cursor-pointer">
        <CardBody>
          <div className="flex justify-between">
            <p>
              {contact.firstName} {contact.lastName}
            </p>
            <p>{contact.job ?? ''}</p>
          </div>
          <div className="flex justify-between">
            <p>{contact.email ?? ''}</p>
            <p>{contact.phone ?? ''}</p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full justify-end">
            <Button onClick={onEditModalOpen} variant="flat" color="warning" className="mx-2">
              Modifier
            </Button>
            <Button onClick={onDeleteModalOpen} variant="flat" color="danger">
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ContactForm
        events={events}
        isOpen={IsEditModalOpen}
        onOpenChange={onEditOpenChange}
        onClose={onEditClose}
        contactWithEvents={contactWithEvents}
      />

      <DeleteModal
        title="Supprimer un contact"
        confirmationText={deleteModalMessage}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteOpenChange}
        deleteFn={deleteContact}
        modelInstance={contact}
      />
    </>
  )
}
