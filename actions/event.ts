'use server'

import { EventService } from '@/back/services/EventService'
import { BaseFormState } from '@/actions/main'
import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { EventCreateInput } from '@/back/models/Event'
import { Event } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export interface EventFormState extends BaseFormState {
  errors: {
    name: string[]
    city: string[]
    number: string[]
    street: string[]
    zipCode: string[]
    startingAt: string[]
    endingAt: string[]
    _form: string[]
  }
}

export async function createEmptyEventFormStateError(): Promise<EventFormState> {
  return {
    errors: {
      name: [],
      city: [],
      number: [],
      street: [],
      zipCode: [],
      startingAt: [],
      endingAt: [],
      _form: [],
    },
  }
}

export async function getEvents() {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('User should be identified')
  }
  const eventService = new EventService()
  return await eventService.findAll()
}

export async function updateEvent(event: Event, formData: unknown): Promise<EventFormState> {
  const res = await createEmptyEventFormStateError()
  const session = await auth()

  if (!session || !session.user) {
    res.errors._form.push('Vous devez être identifié pour effectuer cette action')
    return res
  }
  if (session.user.roleCategory !== RoleCategories.Married) {
    res.errors._form.push('Vous n avez pas les permissions requises pour effecturer cette action')
    return res
  }

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

  try {
    const eventService = new EventService()
    await eventService.update(event.id, result.data)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          ...res.errors,
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          ...res.errors,
          _form: ['Failed to update the event'],
        },
      }
    }
  }

  revalidatePath('/')

  return res
}

export async function deleteEvent(event: Event): Promise<BaseFormState> {
  const res: BaseFormState = {
    errors: { _form: [] },
  }

  // [IMP] check id + session in external function + same for errorHandler
  const session = await auth()

  if (!session || !session.user) {
    res.errors._form.push('Vous devez être identifié pour effectuer cette action')
    return res
  }
  if (session.user.roleCategory !== RoleCategories.Married) {
    res.errors._form.push('Vous n avez pas les permissions requises pour effecturer cette action')
    return res
  }

  try {
    const eventService = new EventService()
    await eventService.delete(event.id)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          ...res.errors,
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          ...res.errors,
          _form: ['Failed to delete the event'],
        },
      }
    }
  }
  // [imp] possible ici
  revalidatePath('/')
  return res
}
