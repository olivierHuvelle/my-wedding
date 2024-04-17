import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'

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

  async delete(id: number) {
    return await this._prisma.guest.delete({
      where: { id },
    })
  }

  async update(id: number, userId: number, eventIds: number[], data: Prisma.GuestUpdateInput) {
    const user = await this._prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas`)
    }

    const existingEvents = await this._prisma.event.findMany({
      where: {
        id: {
          in: eventIds,
        },
      },
    })

    const missingEventIds = eventIds.filter((eventId) => !existingEvents.some((event) => event.id === eventId))

    if (missingEventIds.length > 0) {
      throw new Error(`Certains événements avec les IDs [${missingEventIds.join(', ')}] n'existent pas.`)
    }

    const eventsToDisconnect = await this._prisma.guest
      .findUnique({
        where: { id },
        include: {
          events: true,
        },
      })
      .then(
        (guest) => guest?.events.map((event) => event.eventId).filter((eventId) => !eventIds.includes(eventId)) || [],
      )

    try {
      return await this._prisma.guest.update({
        where: { id },
        data: {
          ...data,
          userId,
          events: {
            connect: eventIds.map((eventId) => ({ eventId_guestId: { eventId, guestId: id } })),
            disconnect: eventsToDisconnect.map((eventId) => ({ eventId_guestId: { eventId, guestId: id } })),
          },
        },
      })
    } catch (err) {
      throw new Error("Erreur lors de la mise à jour de l'invité")
    }
  }
}
