'use server'

import { EventService } from '@/back/services/EventService'
import { BaseFormState, createEmptyEventFormState, createEmptyFormState, EventFormState } from '@/actions/main'
import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { EventCreateInput } from '@/back/models/Event'
import { Event } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { hasRole, isAuthenticated, PermissionDenied, UnauthenticatedError } from '@/actions/authentication'

export async function getEvent(id: number) {
  isAuthenticated(await auth())
  const eventService = new EventService()
  return await eventService.get(id)
}

export async function getEvents() {
  isAuthenticated(await auth())
  const eventService = new EventService()
  return await eventService.findAll()
}

async function checkEventPermissions() {
  const session = await auth()
  isAuthenticated(session)
  hasRole(session, RoleCategories.Married)
}

export async function updateEvent(event: Event, formData: unknown): Promise<EventFormState> {
  const res = createEmptyEventFormState()

  try {
    await checkEventPermissions()

    const result = EventCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    result.data.startingAt = new Date(result.data.startingAt.getTime() + 2 * 60 * 60 * 1000)
    result.data.endingAt = new Date(result.data.endingAt.getTime() + 2 * 60 * 60 * 1000)

    if (result.data.startingAt > result.data.endingAt) {
      return {
        errors: {
          ...res.errors,
          startingAt: ['le début doit être antérieur à la fin'],
        },
      }
    }

    const eventService = new EventService()
    await eventService.update(event.id, result.data)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la mise à jour de l'événement, veuillez réessayer plus tard")
      return res
    }
  }
}

export async function deleteEvent(event: Event): Promise<BaseFormState> {
  const res = createEmptyFormState()

  try {
    await checkEventPermissions()
    const eventService = new EventService()
    await eventService.delete(event.id)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la suppression de l'événement, veuillez réessayer plus tard")
      return res
    }
  }
}
