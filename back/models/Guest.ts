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
    .max(255, { message: 'les interdits alimentaires doivent contenir au plus 255 caractères' }),
  menu: z.enum([Menu.Adult, Menu.Child, Menu.None]),
  remark: z.string().optional(),
  zipCode: z
    .string()
    .trim()
    .min(1, { message: 'le code postal doit contenir au minimum 1 caractère' })
    .max(255, { message: 'le code postal doit contenir au plus 255 caractères' }),
  number: z
    .string()
    .trim()
    .min(1, { message: 'le numéro doit contenir au minimum 1 caractère' })
    .max(255, { message: 'le numéro doit contenir au minimum 1 caractère' }),
  street: z
    .string()
    .trim()
    .min(1, { message: 'la rue doit contenir au minimum 1 caractère' })
    .max(255, { message: 'la rue doit contenir au plus 255 caractères' }),
  city: z
    .string()
    .trim()
    .min(1, { message: 'la ville doit contenir au minimum 1 caractère' })
    .max(255, { message: 'la ville doit contenir au plus 255 caractères' }),
  phone: z.string().optional(),
}) satisfies z.Schema<Prisma.GuestUncheckedCreateInput>
