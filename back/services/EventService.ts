import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'

export class EventService {
  protected _prisma = prisma

  async findAll() {
    return await this._prisma.event.findMany({
      orderBy: {
        startingAt: 'asc',
      },
    })
  }

  async update(id: number, data: Prisma.EventUpdateInput) {
    return await this._prisma.event.update({
      where: { id },
      data,
    })
  }

  async delete(id: number) {
    return await this._prisma.event.delete({
      where: { id },
    })
  }
}
