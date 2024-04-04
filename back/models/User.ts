import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const UserCreateInput = z.object({
  roleId: z.number().int().positive({ message: 'roleId doit être un entier strictement positif' }),
  email: z.string().email({ message: "l'adresse mail doit être valide" }),
  password: z
    .string()
    .trim()
    .min(5, { message: 'le mot de passe doit contenir minimum 5 caractères' })
    .max(255, { message: 'le mot de passe doit contenir maximum 255 caractères' }),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>
