import { getUsers } from '@/actions/user'
import NotificationEmptyCard from '@/components/notification/notification-empty-card'
import NotificationCard from '@/components/notification/notification-card'
export default async function NotificationMarriedList() {
  const users = await getUsers()
  const minGuestPerUser = 1
  const maxGuestPerUser = 4
  const notifications = users.filter(
    (user) => user.guests.length < minGuestPerUser || user.guests.length > maxGuestPerUser,
  )

  return (
    <section className="my-4">
      <h2 className="text-2xl">Notifications</h2>
      {notifications.length === 0 && <NotificationEmptyCard />}
      {notifications.length > 0 &&
        notifications.map((notification) => <NotificationCard user={notification} key={notification.id} />)}
    </section>
  )
}
