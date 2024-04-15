import { Session } from 'next-auth'
import { RoleCategories } from '@/utils/paths'

export class UnauthenticatedError extends Error {
  constructor(message: string) {
    const errorMessage = message && message.trim().length > 0 ? message : 'Unauthenticated'
    super(errorMessage)
    this.name = 'UnauthenticatedError'
  }
}

export class PermissionDenied extends Error {
  constructor(message: string) {
    const errorMessage = message && message.trim().length > 0 ? message : 'Permission denied'
    super(errorMessage)
    this.name = 'PermissionDenied'
  }
}

export function isAuthenticated(session: Session | null) {
  if (!session || !session.user) {
    throw new UnauthenticatedError('Vous devez être authentifié pour exécuter cette action')
  }
}

export function hasRole(session: Session | null, roleCategory: RoleCategories) {
  if (session?.user.roleCategory !== roleCategory) {
    throw new PermissionDenied("Vous n'avez pas les permissions pour exécuter cette action")
  }
}
