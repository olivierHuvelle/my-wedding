import { BaseSeeder } from './BaseSeeder'

export class ContactEventSeeder extends BaseSeeder {
  constructor() {
    super()
  }

  async seed() {
    console.log('starting seeding contactEvents')
    const events = await this._prisma.event.findMany({})
    const contacts = await this._prisma.contact.findMany({})
    const contactEventRecords: { contactId: number; eventId: number }[] = []

    for (const event of events) {
      const shuffledContacts = contacts.sort(() => 0.5 - Math.random())
      const nbContacts = Math.floor(Math.random() * (shuffledContacts.length + 1))
      const selectedContacts = shuffledContacts.slice(0, nbContacts)
      for (const contact of selectedContacts) {
        contactEventRecords.push({
          contactId: contact.id,
          eventId: event.id,
        })
      }
    }

    await this._prisma.contactEvent.createMany({
      data: contactEventRecords,
    })
    console.log('ended seeding contactEvents')
  }
}
