'use client'

import { Button, useDisclosure } from '@nextui-org/react'
import { IoAddCircleOutline } from 'react-icons/io5'
import ContactForm from '@/components/contact/contact-form'
import { Event } from '@prisma/client'

interface ContactTitleProps {
  events: Event[]
}

export default function ContactTile({ events }: ContactTitleProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  return (
    <>
      <h2 className="flex w-full flex-row justify-between px-4 text-2xl md:px-0">
        <div>Contacts</div>
        <Button isIconOnly color="success" variant="flat" aria-label="Add" onClick={onOpen}>
          <IoAddCircleOutline className="text-2xl" />
        </Button>

        <ContactForm events={events} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
      </h2>
    </>
  )
}
