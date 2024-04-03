import { BaseSeeder } from './BaseSeeder'

export class EventSeeder extends BaseSeeder {
  constructor() {
    super()
  }

  async seed() {
    console.log('starting seeding events')

    await this._prisma.event.createMany({
      data: [
        {
          name: 'Cérémonie',
          startingAt: new Date(Date.UTC(2024, 9, 12, 11, 0)),
          endingAt: new Date(Date.UTC(2024, 9, 12, 12, 0)),
          zipCode: '6740',
          number: '15',
          street: 'rue du Moulin',
          city: 'Etalle',
        },
        {
          name: 'Restaurant',
          startingAt: new Date(Date.UTC(2024, 9, 12, 12, 30)),
          endingAt: new Date(Date.UTC(2024, 9, 12, 17, 30)),
          zipCode: '6700',
          number: '25',
          street: 'Burewee',
          city: 'Arlon',
        },
        {
          name: 'After',
          startingAt: new Date(Date.UTC(2024, 9, 12, 17, 30)),
          endingAt: new Date(Date.UTC(2024, 9, 12, 23, 59)),
          zipCode: '6740',
          number: '2',
          street: 'rue Joseph Weicker',
          city: 'Villers-sur-Semois',
        },
      ],
    })

    console.log('ended seeding events')
  }
}
