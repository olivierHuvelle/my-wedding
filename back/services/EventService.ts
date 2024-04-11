import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'

export class EventService {
  protected _prisma = prisma

  async findAll() {
    return await this._prisma.event.findMany({})
  }

  async update(id: number, data: Prisma.EventUpdateInput) {
    return await this._prisma.event.update({
      where: { id },
      data,
    })
  }
}
