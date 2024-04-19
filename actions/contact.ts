'use server'

import { auth } from '@/utils/auth'
import { RoleCategories } from '@/utils/paths'
import { ContactService } from '@/back/services/ContactService'
import { isAuthenticated, PermissionDenied, UnauthenticatedError } from '@/actions/authentication'
import { createEmptyContactFormState, ContactFormState, BaseFormState, createEmptyFormState } from '@/actions/main'
import { Contact } from '@prisma/client'
import { ContactCreateInput } from '@/back/models/Contact'
import paths from '@/utils/paths'
import { revalidatePath } from 'next/cache'

async function checkContactPermissions() {
  const session = await auth()
  isAuthenticated(session)
  if (session?.user.roleCategory !== RoleCategories.Married) {
    throw new PermissionDenied()
  }
}

export async function deleteContact(contact: Contact): Promise<BaseFormState> {
  const res = createEmptyFormState()
  try {
    await checkContactPermissions()
    const contactService = new ContactService()
    await contactService.delete(contact.id)
    revalidatePath(paths.married.url)
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push('Erreur lors de la suppression du contact, veuillez réessayer plus tard')
      return res
    }
  }
}

export async function updateContact(
  contact: Contact,
  formData: unknown,
  eventIds: number[],
): Promise<ContactFormState> {
  const res = createEmptyContactFormState()
  try {
    await checkContactPermissions()
    const result = ContactCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const contactService = new ContactService()
    await contactService.update(contact.id, eventIds, result.data)
    revalidatePath(paths.married.url)
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push('Erreur lors de la mise à jour du contact, veuillez réessayer plus tard')
      return res
    }
  }
}

export async function createContact(formData: unknown, eventIds: number[]): Promise<ContactFormState> {
  const res = createEmptyContactFormState()
  try {
    await checkContactPermissions()
    const result = ContactCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const contactService = new ContactService()
    await contactService.create(eventIds, result.data)
    revalidatePath(paths.married.url)
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push('Erreur lors de la création du contact, veuillez réessayer plus tard')
      return res
    }
  }
}
