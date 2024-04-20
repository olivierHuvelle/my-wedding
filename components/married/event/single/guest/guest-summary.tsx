import { Card, CardHeader, CardBody, Divider } from '@nextui-org/react'
import { Guest, Menu } from '@prisma/client'

interface GuestSummaryProps {
  guests: Guest[]
}

export default function GuestSummary({ guests }: GuestSummaryProps) {
  const nbGuests = guests.length
  const children = guests.filter((guest) => guest.isChild).sort((a, b) => ((a.age as number) - b.age) as number)
  const adults = guests.filter((guest) => !guest.isChild)

  const menuStats: Record<Menu, number> = guests.reduce(
    (acc, guest) => {
      const menuKey = guest.menu
      if (!acc[menuKey]) {
        acc[menuKey] = 1
      } else {
        acc[menuKey]++
      }
      return acc
    },
    {} as Record<Menu, number>,
  )

  return (
    <Card className="my-2 w-full cursor-pointer">
      <CardHeader>
        <h2 className="text-2xl">Résumé</h2>
      </CardHeader>
      <Divider />
      <CardBody>
        <ul>
          <li>Invités : {nbGuests}</li>
          <li>Adultes : {adults.length}</li>
          <li>
            Enfants : {children.length} , ages {children.map((child) => child.age ?? 0).join(', ')}
          </li>
          <li>
            Menus{' '}
            {Object.entries(menuStats).map(([menu, count]) => (
              <span key={menu}>
                {menu}: {count}{' '}
              </span>
            ))}
          </li>
        </ul>
      </CardBody>
    </Card>
  )
}
