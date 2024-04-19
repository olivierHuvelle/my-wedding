import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const ContactCreateInput = z.object({
  job: z
    .string()
    .trim()
    .min(3, { message: 'le téléphone doit contenir au minimum 3 caractères' })
    .max(255, { message: 'le téléphone doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(3, { message: 'le téléphone doit contenir au minimum 3 caractères' })
    .max(255, { message: 'le téléphone doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
  email: z.string().email({ message: 'veuillez entrez une adresse email valide' }).optional().or(z.literal('')),
  firstName: z
    .string()
    .min(3, { message: 'le prénom doit contenir au minimum 3 caractères' })
    .max(255, { message: 'le prénom doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
  lastName: z
    .string()
    .min(3, { message: 'le nom doit contenir au minimum 3 caractères' })
    .max(255, { message: 'le nom doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
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
  remark: z.string().optional(),
}) satisfies z.Schema<Prisma.ContactUncheckedCreateInput>
