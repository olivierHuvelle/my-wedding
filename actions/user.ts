'use server'

import { auth } from '@/utils/auth'
import { isAuthenticated, PermissionDenied, UnauthenticatedError } from '@/actions/authentication'
import { RoleCategories } from '@/utils/paths'
import { User } from '@prisma/client'
import {
  createEmptyUserFormState,
  UserFormState,
  createEmptyMarriedUserFormState,
  MarriedUserFormState,
  createEmptyFormState,
  BaseFormState,
} from '@/actions/main'
import { revalidatePath } from 'next/cache'
import { UserService } from '@/back/services/UserService'
import { loginSchema, UserCreateInput } from '@/back/models/User'

async function checkUserPermissions(userId: number) {
  const session = await auth()
  isAuthenticated(session)
  if (session?.user.roleCategory !== RoleCategories.Married && session?.user.id !== userId) {
    throw new PermissionDenied()
  }
}

export async function getUsers() {
  const session = await auth()
  isAuthenticated(session)
  if (session?.user.roleCategory !== RoleCategories.Married) {
    throw new PermissionDenied()
  }
  const userService = new UserService()
  return await userService.findAll()
}

export async function deleteUser(user: User): Promise<BaseFormState> {
  const res = createEmptyFormState()
  try {
    const session = await auth()
    isAuthenticated(session)
    if (session?.user.roleCategory !== RoleCategories.Married) {
      throw new PermissionDenied()
    }
    const userService = new UserService()
    await userService.delete(user.id)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la suppression de l'utlisateur, veuillez réessayer plus tard")
      return res
    }
  }
}

export async function getUser(userId: number) {
  await checkUserPermissions(userId)
  const userService = new UserService()
  return await userService.getUser(userId)
}

export async function updateUser(user: User, formData: unknown): Promise<UserFormState> {
  const res = createEmptyUserFormState()
  try {
    await checkUserPermissions(user.id)
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const userService = new UserService()
    await userService.update(user.id, result.data)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push('Erreur lors de la mise à jour du profile, veuillez réessayer plus tard')
      return res
    }
  }
}

export async function createUser(formData: unknown): Promise<UserFormState> {
  const res = createEmptyUserFormState()
  try {
    const session = await auth()
    isAuthenticated(session)
    if (session?.user.roleCategory !== RoleCategories.Married) {
      throw new PermissionDenied()
    }
    const result = UserCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const userService = new UserService()
    await userService.create(result.data)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la création de l'utilisateur, veuillez réessayer plus tard")
      return res
    }
  }
}

export async function marriedUpdateUser(user: User, formData: unknown): Promise<MarriedUserFormState> {
  const res = createEmptyMarriedUserFormState()
  try {
    const session = await auth()
    isAuthenticated(session)
    if (session?.user.roleCategory !== RoleCategories.Married) {
      throw new PermissionDenied()
    }
    const result = UserCreateInput.safeParse(formData)
    if (!result.success) {
      return {
        errors: {
          ...res.errors,
          ...result.error.flatten().fieldErrors,
        },
      }
    }
    const userService = new UserService()
    await userService.update(user.id, result.data)
    revalidatePath('/')
    return res
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof PermissionDenied || err instanceof Error) {
      res.errors._form.push(err.message)
      return res
    } else {
      res.errors._form.push("Erreur lors de la mise à jour de l'utilisateur, veuillez réessayer plus tard")
      return res
    }
  }
}
