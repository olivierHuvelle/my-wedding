import EventMarriedList from '@/components/married/event/list/event-married-list'
import NotificationMarriedList from '@/components/married/event/list/notification-married-list'
import { Button, Link } from '@nextui-org/react'
import paths from '@/utils/paths'

export default function MarriedPage() {
  return (
    <div>
      <section className="my-4 flex w-full justify-between">
        <h2 className="text-2xl">Utilisateurs</h2>
        <Button href={paths.users.url} as={Link} variant="flat" color="primary">
          Aller à la page
        </Button>
      </section>
      <NotificationMarriedList />
      <EventMarriedList />
    </div>
  )
}
