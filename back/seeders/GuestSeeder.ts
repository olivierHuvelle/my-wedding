import { BaseSeeder } from './BaseSeeder'
import { GuestFactory } from '../factories/GuestFactory'

export class GuestSeeder extends BaseSeeder {
  constructor() {
    super()
  }

  async seed() {
    console.log('starting seeding guests')
    const users = await this._prisma.user.findMany({})
    const olivier = users.find((user) => user.identifier === 'olivier.huvelle@gmail.com')
    const laurie = users.find((user) => user.identifier === 'laurie.swenen@gmail.com')
    const otherGuestUsers = users.filter(
      (user) => !['olivier.huvelle@gmail.com', 'laurie.swenen@gmail.com'].includes(user.identifier),
    )
    const factory = new GuestFactory()
    await this._prisma.guest.createMany({
      data: [factory.createOlivier(olivier?.id as number), factory.createLaurie(laurie?.id as number)],
    })

    await this._prisma.guest.createMany({
      data: otherGuestUsers.map((user) => factory.createAdultForUserId(user.id)),
    })

    const firstGuests = await this._prisma.guest.findMany({
      where: {
        userId: {
          in: otherGuestUsers.map((user) => user.id),
        },
      },
    })

    for (const guest of firstGuests) {
      if (Math.random() > 0.5) {
        await this._prisma.guest.createMany({
          data: [factory.createAdultForGuest(guest)],
        })
      }

      if (Math.random() > 0.5) {
        await this._prisma.guest.createMany({
          data: [factory.createYoungChildForGuest(guest)],
        })
      }

      if (Math.random() > 0.5) {
        await this._prisma.guest.createMany({
          data: [factory.createMidAgedChildForUserId(guest)],
        })
      }
    }

    console.log('ended seeding guests')
  }
}
