import { BaseSeeder } from './BaseSeeder'

export class RoleSeeder extends BaseSeeder {
  constructor() {
    super()
  }
  async seed() {
    console.log('starting seeding roles')
    await this._prisma.role.createMany({
      data: [{ name: 'marié' }, { name: 'invité' }, { name: 'professionnel' }],
    })

    const guestRole = await this._prisma.role.findUnique({
      where: { name: 'invité' },
    })

    if (!guestRole) {
      throw new Error('impossible to find guest role')
    }

    await this._prisma.role.create({
      data: {
        name: 'témoin',
        parentId: guestRole.id,
      },
    })
    console.log('ended seeding roles')
  }
}
