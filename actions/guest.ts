'use server'

import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { GuestService } from '@/back/services/GuestService'
import { isAuthenticated, PermissionDenied, UnauthenticatedError } from '@/actions/authentication'
import { Guest } from '@prisma/client'
import { BaseFormState, createEmptyFormState, createEmptyGuestFormState } from '@/actions/main'
import { revalidatePath } from 'next/cache'
import { GuestCreateInput } from '@/back/models/Guest'

async function checkGuestPermissions(userId: number) {
  const session = await auth()
  isAuthenticated(session)
  if (session?.user.roleCategory !== RoleCategories.Married && session?.user.id !== userId) {
    throw new PermissionDenied()
  }
}

export async function getGuestsForUserId(userId: number) {
  await checkGuestPermissions(userId)
  const guestService = new GuestService()
  return await guestService.findAllGuestsForUserId(userId)
}

export async function deleteGuest(guest: Guest): Promise<BaseFormState> {
  const res = createEmptyFormState()
  try {
    await checkGuestPermissions(guest.userId)
    const guestService = new GuestService()
    await guestService.delete(guest.id)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la suppression de l'invité, veuillez réessayer plus tard")
      return res
    }
  }
}

export async function updateGuest(guest: Guest, formData: unknown, eventIds: number[]) {
  const res = createEmptyGuestFormState()
  try {
    await checkGuestPermissions(guest.userId)
    const result = GuestCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const guestService = new GuestService()
    await guestService.update(guest.id, result.data.userId, eventIds, result.data)
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
