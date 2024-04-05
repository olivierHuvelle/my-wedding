'use server'
import { cookies } from 'next/headers'
import { UserService } from '@/back/services/UserService'
import { AuthenticationService } from '@/back/services/AuthenticationService'
import { BaseFormState } from '@/actions/main'
import { Prisma } from '@prisma/client'
import { SessionService } from '@/back/services/SessionService'
import { redirect } from 'next/navigation'
import { IncorrectPasswordError } from '@/back/services/UserService'
import { loginSchema } from '@/back/models/User'

export interface LoginFormState extends BaseFormState {
  errors: {
    email: string[]
    password: string[]
    _form: string[]
  }
}

export async function login(formData: unknown): Promise<LoginFormState> {
  const userService = new UserService()
  const sessionService = new SessionService()
  const response: LoginFormState = {
    errors: {
      email: [],
      password: [],
      _form: [],
    },
  }
  const result = loginSchema.safeParse(formData)

  if (!result.success) {
    response.errors = {
      ...response.errors,
      ...result.error.flatten().fieldErrors,
    }
    return response
  }

  try {
    const user = await userService.findUserByEmailAndPassword(result.data.email, result.data.password)
    const expires = new Date(Date.now() + 20 * 60 * 1000)
    const authenticationService = new AuthenticationService()
    const session = await authenticationService.encrypt({ user, expires })
    await sessionService.setSession(session, expires)
  } catch (err: unknown) {
    if (
      (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') ||
      err instanceof IncorrectPasswordError
    ) {
      response.errors._form = ['Mauvais email et/ou mot de passe']
      return response
    } else {
      response.errors._form = ['Une erreur est survenue, veuillez réessayer plus tard']
      return response
    }
  }
  redirect('/')
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) })
  redirect('/')
}
