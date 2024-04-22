import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const EventCreateInput = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Le nom doit contenir au minimum un caractère' })
      .max(255, { message: 'Le nom doit contenir au plus 255 caractères' }),
    zipCode: z
      .string()
      .trim()
      .min(1, { message: 'Le code postal doit contenir au minimum 1 caractère' })
      .max(255, { message: 'Le code postal doit contenir au plus 255 caractères' }),
    number: z
      .string()
      .trim()
      .min(1, { message: 'Le numéro doit contenir au minimum 1 caractère' })
      .max(255, { message: 'Le numéro doit contenir au minimum 1 caractère' }),
    street: z
      .string()
      .trim()
      .min(1, { message: 'La rue doit contenir au minimum 1 caractère' })
      .max(255, { message: 'La rue doit contenir au plus 255 caractères' }),
    city: z
      .string()
      .trim()
      .min(1, { message: 'La ville doit contenir au minimum 1 caractère' })
      .max(255, { message: 'La ville doit contenir au plus 255 caractères' }),
    startingAt: z
      .date()
      .min(new Date(), { message: "La date de début de l'événement doit être postérieure à maintenant" }),
    endingAt: z.date(),
  })
  .refine((data) => data.endingAt > data.startingAt, {
    message: 'La date de fin doit être postérieure à la date de début',
    path: ['endingAt'],
  })
  .innerType() satisfies z.Schema<Prisma.EventUncheckedCreateInput>
