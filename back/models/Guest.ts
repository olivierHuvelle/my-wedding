import { Prisma, Menu } from '@prisma/client'
import { z } from 'zod'

export const GuestCreateInput = z.object({
  userId: z.number().int().min(1, { message: 'Veuillez renseigner un user existant' }),
  firstName: z
    .string()
    .trim()
    .min(3, { message: 'Le prénom doit contenir minimum 3 caractères' })
    .max(255, { message: 'Le prénom doit contenir au plus 255 caractères' }),
  lastName: z
    .string()
    .trim()
    .min(3, { message: 'Le nom doit contenir minimum 3 caractères' })
    .max(255, { message: 'Le nom doit contenir au plus 255 caractères' }),
  isChild: z.boolean(),
  foodProhibitions: z
    .string()
    .trim()
    .max(255, { message: 'Les interdits alimentaires doivent contenir au plus 255 caractères' })
    .nullable()
    .optional(),
  menu: z.enum([Menu.Adulte, Menu.Enfant, Menu.Aucun]),
  remark: z.string().trim().max(255, { message: 'La remarque doit contenir au plus 255 caractères' }).optional(),
  phone: z.string().nullable().optional(),
  age: z
    .number({ invalid_type_error: "L'âge doit être un entier strictement positif" })
    .int({ message: "L'âge doit être un entier strictement positif" })
    .min(1, { message: "L'âge doit être un entier strictement positif" })
    .nullable()
    .optional(),
}) satisfies z.Schema<Prisma.GuestUncheckedCreateInput>
