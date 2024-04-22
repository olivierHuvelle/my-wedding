'use client'
import { Button, useDisclosure } from '@nextui-org/react'
import { IoAddCircleOutline } from 'react-icons/io5'
import EventModalForm from '@/components/event/event-modal-form'

export default function EventTitle() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  return (
    <>
      <h2 className="flex flex-row justify-between px-4 text-2xl md:px-0">
        <div>Evénements</div>
        <Button isIconOnly color="success" variant="flat" aria-label="Add" onClick={onOpen}>
          <IoAddCircleOutline className="text-2xl" />
        </Button>
      </h2>
      <EventModalForm isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  )
}
