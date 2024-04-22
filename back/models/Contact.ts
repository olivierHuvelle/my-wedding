import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const ContactCreateInput = z.object({
  job: z
    .string()
    .trim()
    .min(3, { message: 'Le téléphone doit contenir au minimum 3 caractères' })
    .max(255, { message: 'Le téléphone doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(3, { message: 'Le téléphone doit contenir au minimum 3 caractères' })
    .max(255, { message: 'Le téléphone doit contenir au plus 255 caractères' })
    .optional()
    .or(z.literal('')),
  email: z.string().email({ message: 'Veuillez entrez une adresse email valide' }).optional().or(z.literal('')),
  firstName: z
    .string()
    .min(3, { message: 'Le prénom doit contenir au minimum 3 caractères' })
    .max(255, { message: 'Le prénom doit contenir au plus 255 caractères' }),
  lastName: z
    .string()
    .min(3, { message: 'Le nom doit contenir au minimum 3 caractères' })
    .max(255, { message: 'Le nom doit contenir au plus 255 caractères' }),
  remark: z.string().optional(),
}) satisfies z.Schema<Prisma.ContactUncheckedCreateInput>
