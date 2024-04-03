import { BaseSeeder } from './BaseSeeder'
import { ContactFactory } from '../factories/ContactFactory'

export class ContactSeeder extends BaseSeeder {
  private _factory: ContactFactory
  constructor() {
    super()
    this._factory = new ContactFactory()
  }

  async seed() {
    console.log('starting seeding contacts')
    await this._prisma.contact.createMany({
      data: this._factory.bulkCreate(5),
    })
    console.log('ended seeding contacts')
  }
}
