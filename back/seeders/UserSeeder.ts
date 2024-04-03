import { BaseSeeder } from './BaseSeeder'
import { UserFactory } from '../factories/UserFactory'

export class UserSeeder extends BaseSeeder {
  constructor() {
    super()
  }

  async seed() {
    console.log('starting seeding users')
    const roles = await this._prisma.role.findMany({})

    const roleNotWeddingIds = roles
      .filter((role) => !['Marié', 'Professionnel'].includes(role.name))
      .map((role) => role.id)
    const weddingRoleId = roles.find((role) => role.name === 'Marié')?.id as number
    const factory = new UserFactory(roleNotWeddingIds)
    await this._prisma.user.createMany({
      data: [factory.createOlivier(weddingRoleId), factory.createLaurie(weddingRoleId), ...factory.bulkCreate(10)],
    })
    console.log('ended seeding users')
  }
}
