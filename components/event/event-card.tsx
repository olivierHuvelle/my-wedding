'use client'

import { Card, CardHeader, CardBody, CardFooter, Divider } from '@nextui-org/react'
import { FaLocationArrow } from 'react-icons/fa6'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { FaRegClock } from 'react-icons/fa6'
import { Event } from '@prisma/client'
import { ReactNode } from 'react'

interface EventCardProps {
  event: Event
  children?: ReactNode
}

export default function EventCard({ event, children }: EventCardProps) {
  return (
    <>
      <Card className="my-2 cursor-pointer">
        <CardHeader className="flex gap-3">
          <div className="flex w-full flex-row justify-between">
            <div className="flex items-center">
              <FaRegCalendarCheck className="mr-2 text-2xl" />
              <div className="text-md">{event.name}</div>
            </div>
            <div className="flex items-center">
              <p>
                {event.startingAt
                  .toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                  .replace(/\//g, '/')}
              </p>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-row justify-between">
            <FaLocationArrow className="text-2xl" />
            <p>
              {event.number} {event.street}, {event.zipCode} {event.city}
            </p>
          </div>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full flex-row justify-between">
            <FaRegClock className="text-2xl" />
            <p>
              {event.startingAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
              -
              {event.endingAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              })}
            </p>
          </div>
        </CardFooter>
        {children}
      </Card>
    </>
  )
}
