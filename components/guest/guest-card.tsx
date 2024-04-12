import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from '@nextui-org/react'
import { Guest, Event, EventGuest } from '@prisma/client'

interface GuestCardProps {
  guest: Guest & {
    events: (EventGuest & { event: Event })[]
  }
}

export default function GuestCard({ guest }: GuestCardProps) {
  return (
    <>
      <Card className="my-2 max-w-xl cursor-pointer">
        <CardHeader className="flex gap-3">
          <h3>
            {guest.firstName} {guest.lastName}
          </h3>
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col">
          <section className="flex flex-row justify-between">
            <h3>Evénements</h3>
            <p>{guest.events.length ? guest.events.map((ev) => ev.event.name).join(',') : 'Aucun événement'}</p>
          </section>
          <Divider />
          <section className="flex flex-row justify-between">
            <h3>Interdits alimentaires</h3>
            <p>{guest.foodProhibitions?.length ? guest.foodProhibitions : 'Aucun interdit alimentaire'}</p>
          </section>
          <Divider />
          <section className="flex flex-row justify-between">
            <h3>Menu</h3>
            <p>{guest.menu}</p>
          </section>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="flex w-full flex-row justify-end">
            <Button variant="flat" color="warning" className="mx-2">
              Modifier
            </Button>
            <Button variant="flat" color="danger">
              Supprimer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}
