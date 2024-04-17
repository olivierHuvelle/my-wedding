'use client'
import { Button, useDisclosure } from '@nextui-org/react'
import { IoAddCircleOutline } from 'react-icons/io5'
import GuestForm from '@/components/guest/guest-form'
import { Event } from '@prisma/client'

interface GuestTitleProps {
  userId: number
  events: Event[]
}

export default function GuestTitle({ userId, events }: GuestTitleProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <h2 className="flex flex-row justify-between px-4 text-2xl md:px-0">
        <div>Invités</div>
        <Button isIconOnly color="success" variant="flat" aria-label="Add" onClick={onOpen}>
          <IoAddCircleOutline className="text-2xl" />
        </Button>
      </h2>
      <GuestForm events={events} isOpen={isOpen} onOpenChange={onOpenChange} userId={userId} />
    </>
  )
}
