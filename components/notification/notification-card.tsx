'use client'

import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { Guest, User } from '@prisma/client'

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
        <div className="flex flex-row justify-between">
          <p>Nombre invités : {user.guests.length}</p>
        </div>
      </CardBody>
    </Card>
  )
}
