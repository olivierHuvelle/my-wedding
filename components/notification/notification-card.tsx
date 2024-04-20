'use client'

import { Card, CardBody, CardHeader, CardFooter, Divider, Button, Link } from '@nextui-org/react'
import { Guest, User } from '@prisma/client'
import paths from '@/utils/paths'

interface NotificationCardProps {
  user: User & {
    guests: Guest[]
  }
}

export default function NotificationCard({ user }: NotificationCardProps) {
  return (
    <Card className="my-2 cursor-pointer">
      <CardHeader className="flex gap-3">
        <div className="flex w-full text-center">{user.identifier}</div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex  w-full flex-row justify-between">
          <p>Nombre invités : {user.guests.length}</p>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex w-full flex-row justify-end">
          <Button href={`${paths.marriedGuest.url}${user.id}`} as={Link} variant="flat" color="primary">
            Voir
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
