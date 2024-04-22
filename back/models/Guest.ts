import { Prisma, Menu } from '@prisma/client'
import { z } from 'zod'

export const GuestCreateInput = z.object({
  userId: z.number().int().min(1, { message: 'veuillez renseigner un user existant' }),
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'le prénom doit contenir minimum 3 caractères' })
    .max(255, { message: 'le prénom doit contenir au plus 255 caractères' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'le nom doit contenir minimum 3 caractères' })
    .max(255, { message: 'le nom doit contenir au plus 255 caractères' }),
  isChild: z.boolean(),
  foodProhibitions: z
    .string()
    .trim()
    .max(255, { message: 'les interdits alimentaires doivent contenir au plus 255 caractères' })
    .nullable()
    .optional(),
  menu: z.enum([Menu.Adult, Menu.Child, Menu.None]),
  remark: z.string().trim().max(255, { message: 'la remarque doit contenir au plus 255 caractères' }).optional(),
  phone: z.string().nullable().optional(),
  age: z.number().int().min(1, { message: "l'âge doit être un entier strictement positif" }).nullable().optional(),
}) satisfies z.Schema<Prisma.GuestUncheckedCreateInput>
