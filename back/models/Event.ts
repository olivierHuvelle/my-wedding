import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const EventCreateInput = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'le nom doit contenir au minimum un caractère' })
      .max(255, { message: 'le nom doit contenir au plus 255 caractères' }),
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
    startingAt: z
      .date()
      .min(new Date(), { message: "la date de début de l'événement doit être postérieure à maintenant" }),
    endingAt: z.date(),
  })
  .refine((data) => data.endingAt > data.startingAt, {
    message: 'la date de fin doit être postérieure à la date de début',
    path: ['endingAt'],
  }) satisfies z.Schema<Prisma.EventUncheckedCreateInput>
