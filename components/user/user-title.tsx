'use client'
import { Role } from '@prisma/client'
import { Button, useDisclosure } from '@nextui-org/react'
import { IoAddCircleOutline } from 'react-icons/io5'
import UserForm from '@/components/user/user-form'

interface UserTitleProps {
  roles: Role[]
}

export default function UserTitle({ roles }: UserTitleProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

  return (
    <>
      <h2 className="flex flex-row justify-between px-4 text-2xl md:px-0">
        <div>Utilisateurs</div>
        <Button isIconOnly color="success" variant="flat" aria-label="Add" onClick={onOpen}>
          <IoAddCircleOutline className="text-2xl" />
        </Button>
      </h2>
      <UserForm roles={roles} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
    </>
  )
}
