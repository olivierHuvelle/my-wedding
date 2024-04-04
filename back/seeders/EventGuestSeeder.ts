import { BaseSeeder } from './BaseSeeder'

export class EventGuestSeeder extends BaseSeeder {
  constructor() {
    super()
  }

  async seed() {
    console.log('starting seeding eventguestseeder')

    const events = await this._prisma.event.findMany({})
    const guests = await this._prisma.guest.findMany({})

    const eventGuestRecords: { guestId: number; eventId: number }[] = []

    for (const event of events) {
      const shuffledGuests = guests.sort(() => 0.5 - Math.random())
      const nbGuests = Math.floor(Math.random() * (shuffledGuests.length + 1))
      const selectedGuests = shuffledGuests.slice(0, nbGuests)
      for (const guest of selectedGuests) {
        eventGuestRecords.push({
          guestId: guest.id,
          eventId: event.id,
        })
      }
    }

    await this._prisma.eventGuest.createMany({
      data: eventGuestRecords,
    })

    console.log('ended seeding eventguestseeder')
  }
}
