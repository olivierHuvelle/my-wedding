'use server'

import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { GuestService } from '@/back/services/GuestService'

export async function getGuestsForUserId(userId: number) {
  const session = await auth()
  if (!session || !session.user) {
    throw new Error('user should be identified')
  }
  if (session.user.roleCategory !== RoleCategories.Married && session.user.id !== userId) {
    throw new Error('permission denied')
  }
  const guestService = new GuestService()
  return await guestService.findAllGuestsForUserId(userId)
}
