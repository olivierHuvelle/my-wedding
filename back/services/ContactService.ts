import prisma from '@/back/database/db'
import { Prisma } from '@prisma/client'

export class ContactService {
  protected _prisma = prisma

  async delete(id: number) {
    return await this._prisma.contact.delete({
      where: { id },
    })
  }
  async update(id: number, eventIds: number[], data: Prisma.ContactUpdateInput) {
    try {
      const updatedGuest = await this._prisma.$transaction(async (prisma) => {
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

        await prisma.contactEvent.deleteMany({
          where: {
            contactId: id,
          },
        })

        await prisma.contactEvent.createMany({
          data: eventIds.map((eventId) => ({
            eventId,
            contactId: id,
          })),
        })

        return prisma.contact.update({
          where: { id },
          data,
        })
      })
      return updatedGuest
    } catch (err) {
      throw new Error('Erreur lors de la mise à jour du contact')
    }
  }

  async create(eventIds: number[], data: Prisma.ContactCreateInput) {
    try {
      const createdContact = await this._prisma.$transaction(async (prisma) => {
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

        const createdContact = await prisma.contact.create({
          data,
        })

        await prisma.contactEvent.createMany({
          data: eventIds.map((eventId) => ({
            eventId,
            contactId: createdContact.id,
          })),
        })

        return createdContact
      })

      return createdContact
    } catch (err) {
      throw new Error('Error lors de la création du contact')
    }
  }
}
