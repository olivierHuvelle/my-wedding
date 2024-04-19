'use client'

import { Button, Card, CardBody, CardFooter, Divider, useDisclosure } from '@nextui-org/react'
import { Event } from '@prisma/client'
import { ContactWithEvents } from '@/app/married/event/[id]/page'
import ContactForm from '@/components/contact/contact-form'
interface ContactCardProps {
  contactWithEvents: ContactWithEvents
  events: Event[]
}

export default function ContactCard({ contactWithEvents, events }: ContactCardProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  const { contact } = contactWithEvents

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
            <Button onClick={onOpen} variant="flat" color="warning">
              Modifier
            </Button>
          </div>
        </CardFooter>
      </Card>
      <ContactForm
        events={events}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        contactWithEvents={contactWithEvents}
      />
    </>
  )
}
