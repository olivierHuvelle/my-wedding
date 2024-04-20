import EventMarriedList from '@/components/married/event/list/event-married-list'
import NotificationMarriedList from '@/components/married/event/list/notification-married-list'

export default function MarriedPage() {
  return (
    <div>
      <NotificationMarriedList />
      <EventMarriedList />
    </div>
  )
}
