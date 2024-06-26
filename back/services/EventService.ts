import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'

export class EventService {
  protected _prisma = prisma

  async get(id: number) {
    return await this._prisma.event.findFirstOrThrow({
      where: { id },
      include: {
        contacts: {
          include: {
            contact: {
              include: {
                events: true,
              },
            },
          },
        },
        guests: {
          include: {
            guest: true,
          },
        },
      },
    })
  }

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

  async create(data: Prisma.EventUncheckedCreateInput) {
    return await this._prisma.event.create({
      data,
    })
  }
}
