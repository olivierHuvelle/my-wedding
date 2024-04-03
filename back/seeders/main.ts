import { PrismaClient } from '@prisma/client'
import { RoleSeeder } from './RoleSeeder'
import { ContactSeeder } from './ContactSeeder'
import { EventSeeder } from './EventSeeder'
import { UserSeeder } from './UserSeeder'

const prisma = new PrismaClient()

async function main() {
  const roleSeeder = new RoleSeeder()
  const contactSeeder = new ContactSeeder()
  const eventSeeder = new EventSeeder()
  const userSeeder = new UserSeeder()
  try {
    await roleSeeder.seed()
    await contactSeeder.seed()
    await eventSeeder.seed()
    await userSeeder.seed()
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
