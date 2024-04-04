import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const RoleCreateInput = z.object({
  parentId: z.number().int().positive({ message: 'parentId doit être un entier strictement positif' }),
  name: z
    .string()
    .trim()
    .min(1, { message: 'le nom du rôle doit être une chaine de caractère non vide' })
    .max(255, { message: 'le nom du rôme doit contenir au plus 255 caractères' }),
}) satisfies z.Schema<Prisma.RoleUncheckedCreateInput>
