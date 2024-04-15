'use server'

import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { GuestService } from '@/back/services/GuestService'
import { isAuthenticated, PermissionDenied } from '@/actions/authentication'

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
