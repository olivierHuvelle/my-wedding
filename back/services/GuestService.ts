import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'
import GuestUncheckedCreateInput = Prisma.GuestUncheckedCreateInput

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

  async findAll() {
    return await this._prisma.guest.findMany({
      include: {
        events: {
          include: {
            event: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    })
  }

  async delete(id: number) {
    return await this._prisma.guest.delete({
      where: { id },
    })
  }

  async update(id: number, userId: number, eventIds: number[], data: Prisma.GuestUpdateInput) {
    try {
      const updatedGuest = await this._prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!user) {
          throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas`)
        }

        const existingEvents = await prisma.event.findMany({
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

        await prisma.eventGuest.deleteMany({
          where: {
            guestId: id,
          },
        })

        const newEventGuestAssociations = eventIds.map((eventId) => ({
          eventId,
          guestId: id,
        }))

        await prisma.eventGuest.createMany({
          data: newEventGuestAssociations,
        })

        return prisma.guest.update({
          where: { id },
          data: {
            ...data,
            userId,
            user: undefined,
          },
          include: {
            events: {
              include: {
                event: true,
              },
            },
          },
        })
      })

      return updatedGuest
    } catch (err) {
      throw new Error("Erreur lors de la mise à jour de l'invité")
    }
  }

  async create(userId: number, eventIds: number[], data: GuestUncheckedCreateInput) {
    try {
      const createdGuest = await this._prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!user) {
          throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas`)
        }

        const existingEvents = await prisma.event.findMany({
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

        const existingGuest = await prisma.guest.findFirst({
          where: {
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
          },
        })
        if (existingGuest) {
          return existingGuest
        }

        const createdGuest = await prisma.guest.create({
          data: {
            ...data,
            userId,
          },
        })

        const newEventGuestAssociations = eventIds.map((eventId) => ({
          eventId,
          guestId: createdGuest.id,
        }))

        await prisma.eventGuest.createMany({
          data: newEventGuestAssociations,
        })

        return createdGuest
      })

      return createdGuest
    } catch (err) {
      throw new Error("Erreur lors de la création de l'invité")
    }
  }
}
