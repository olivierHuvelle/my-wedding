import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const UserCreateInput = z.object({
  roleId: z.number().int().positive({ message: 'roleId doit être un entier strictement positif' }),
  identifier: z
    .string()
    .min(5, { message: "l'identifiant doit avoir une longueur minimale de 5 caractères" })
    .max(255, { message: "l'identifiant doit contenir au plus 255 caractères" }),
  password: z
    .string()
    .trim()
    .min(5, { message: 'le mot de passe doit contenir minimum 5 caractères' })
    .max(255, { message: 'le mot de passe doit contenir maximum 255 caractères' }),
}) satisfies z.Schema<Prisma.UserUncheckedCreateInput>

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(5, { message: "l'identifiant doit avoir une longueur minimale de 5 caractères" })
    .max(255, { message: "l'identifiant doit contenir au plus 255 caractères" }),
  password: z
    .string()
    .trim()
    .min(5, { message: 'le mot de passe doit contenir minimum 5 caractères' })
    .max(255, { message: 'le mot de passe doit contenir maximum 255 caractères' }),
})
