'use client'

import { Card, CardHeader, CardBody, CardFooter, Divider, Button, useDisclosure } from '@nextui-org/react'
import UserForm from '@/components/user/user-form'
import DeleteModal from '@/components/ui/delete-modal'
import { User, Role, Guest } from '@prisma/client'
import { deleteUser } from '@/actions/user'

interface UserCardProps {
  user: User & {
    guests: Guest[]
  }
  roles: Role[]
}

export default function UserCard({ user, roles }: UserCardProps) {
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteOpenChange } = useDisclosure()

  return (
    <>
      <Card className="my-2 max-w-xl cursor-pointer">
        <CardHeader className="flex gap-3">
          <h3>{user.identifier}</h3>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col">
          <section className="flex flex-row justify-between">
            <p>Invités : {user.guests.length}</p>
          </section>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full flex-row justify-end">
            <Button onClick={onEditModalOpen} variant="flat" color="warning" className="mx-2">
              Modifier
            </Button>
            <Button onClick={onDeleteModalOpen} variant="flat" color="danger">
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>
      <UserForm
        user={user}
        isOpen={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        onClose={onEditClose}
        roles={roles}
      />
      <DeleteModal
        title="Supprimer un utilisateur"
        confirmationText={`Etes-vous certain de vouloir supprimer l'utilisateur ${user.identifier}`}
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteOpenChange}
        deleteFn={deleteUser}
        modelInstance={user}
      />
    </>
  )
}
