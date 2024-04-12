import prisma from '@/back/database/db'

export class GuestService {
  protected _prisma = prisma

  async findAllGuestsForUserId(userId: number) {
    return await this._prisma.guest.findMany({
      where: {
        userId,
      },
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
    })
  }
}
