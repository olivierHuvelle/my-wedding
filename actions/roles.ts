import { auth } from '@/utils/auth'
import { hasRole, isAuthenticated } from '@/actions/authentication'
import { RoleCategories } from '@/utils/paths'
import { RoleService } from '@/back/services/RoleService'

async function checkRolePermission() {
  const session = await auth()
  isAuthenticated(session)
  hasRole(session, RoleCategories.Married)
}

export async function getRoles() {
  await checkRolePermission()
  const service = new RoleService()
  return await service.findAll()
}
