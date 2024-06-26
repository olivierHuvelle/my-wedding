import prisma from '../database/db'
import { RoleSeeder } from './RoleSeeder'
import { ContactSeeder } from './ContactSeeder'
import { EventSeeder } from './EventSeeder'
import { UserSeeder } from './UserSeeder'
import { GuestSeeder } from './GuestSeeder'
import { ContactEventSeeder } from './ContactEventSeeder'
import { EventGuestSeeder } from './EventGuestSeeder'

async function main() {
  const roleSeeder = new RoleSeeder()
  const contactSeeder = new ContactSeeder()
  const eventSeeder = new EventSeeder()
  const userSeeder = new UserSeeder()
  const guestSeeder = new GuestSeeder()
  const contactEventSeeder = new ContactEventSeeder()
  const eventGuestSeeder = new EventGuestSeeder()

  try {
    await roleSeeder.seed()
    await contactSeeder.seed()
    await eventSeeder.seed()
    await userSeeder.seed()
    await guestSeeder.seed()
    await contactEventSeeder.seed()
    await eventGuestSeeder.seed()
    console.log('Seed completed successfully.')
  } catch (error) {
    console.error('An error occurred while seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('An unhandled error occurred:', error)
  process.exit(1)
})
