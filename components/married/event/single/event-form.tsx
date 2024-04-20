'use client'

import { useState, useMemo } from 'react'
import useInput from '@/hooks/use-input'
import { Event } from '@prisma/client'
import { EventCreateInput } from '@/back/models/Event'
import { updateEvent } from '@/actions/event'
import { Button, Input } from '@nextui-org/react'
import Alert from '@/components/ui/alert'
import toast from 'react-hot-toast'

interface EventFormProps {
  event: Event
}

export default function EventForm({ event }: EventFormProps) {
  const [formErrors, setFormErrors] = useState<string[]>([])
  const name = useInput(EventCreateInput.pick({ name: true }), 'name', event.name)
  const city = useInput(EventCreateInput.pick({ city: true }), 'city', event.city)
  const number = useInput(EventCreateInput.pick({ number: true }), 'number', event.number)
  const street = useInput(EventCreateInput.pick({ street: true }), 'street', event.street)
  const zipCode = useInput(EventCreateInput.pick({ zipCode: true }), 'zipCode', event.zipCode)
  const startingAt = useInput(
    EventCreateInput.pick({ startingAt: true }),
    'startingAt',
    event.startingAt.toISOString().slice(0, 16).replace('T', ' '),
    (value) => new Date(value),
  )
  const endingAt = useInput(
    EventCreateInput.pick({ endingAt: true }),
    'endingAt',
    event.endingAt.toISOString().slice(0, 16).replace('T', ' '),
    (value) => new Date(value),
  )

  const inputs = useMemo(
    () => [name, city, number, street, zipCode, startingAt, endingAt],
    [name, city, number, street, zipCode, startingAt, endingAt],
  )

  const isConfirmButtonDisabled = inputs.some((input) => input.hasError)

  const reset = () => {
    setFormErrors([])
    inputs.forEach((input) => input.setServerErrors([]))
  }

  const submitHandler = async (formData: FormData) => {
    const data = {
      name: formData.get('name'),
      city: formData.get('city'),
      number: formData.get('number'),
      zipCode: formData.get('zipCode'),
      street: formData.get('street'),
      startingAt: new Date(formData.get('startingAt') as string | Date),
      endingAt: new Date(formData.get('endingAt') as string | Date),
    }
    const result = EventCreateInput.safeParse(data)

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      const keys = Object.keys(errors) as (keyof typeof errors)[]
      for (const key of keys) {
        const input = inputs.find((input) => input.name === key)
        if (input) {
          input.setServerErrors(errors[key]!)
        }
      }
      return
    }

    const response = await updateEvent(event, result.data)

    let hasResponseError = false
    const keys = Object.keys(response.errors) as (keyof typeof response.errors)[]
    for (const key of keys) {
      const input = inputs.find((input) => input.name === key)
      if (input && response.errors[key].length) {
        input.setServerErrors(response.errors[key])
        hasResponseError = true
      }
    }
    if (response.errors._form.length) {
      setFormErrors(response.errors._form)
      hasResponseError = true
    }

    if (!hasResponseError) {
      reset()
      toast.success("L'événement a bien été mis à jour")
    }
  }

  return (
    <form action={submitHandler}>
      <Input
        name="name"
        label="Nom"
        placeholder="Exemple"
        isRequired={true}
        value={name.value}
        onInput={name.inputHandler}
        isInvalid={name.hasError}
        errorMessage={name.errors}
      />
      <Input
        name="city"
        label="Ville"
        placeholder="Arlon"
        isRequired={true}
        value={city.value}
        onInput={city.inputHandler}
        isInvalid={city.hasError}
        errorMessage={city.errors}
      />
      <Input
        name="number"
        label="Numéro"
        placeholder="1"
        isRequired={true}
        value={number.value}
        onInput={number.inputHandler}
        isInvalid={number.hasError}
        errorMessage={number.errors}
      />
      <Input
        name="street"
        label="Rue"
        placeholder="1"
        isRequired={true}
        value={street.value}
        onInput={street.inputHandler}
        isInvalid={street.hasError}
        errorMessage={street.errors}
      />
      <Input
        name="zipCode"
        label="Code postal"
        placeholder="6740"
        isRequired={true}
        value={zipCode.value}
        onInput={zipCode.inputHandler}
        isInvalid={zipCode.hasError}
        errorMessage={zipCode.errors}
      />
      <Input
        name="startingAt"
        label="Début"
        type="datetime-local"
        isRequired={true}
        classNames={{
          label: '-mt-4',
        }}
        value={startingAt.value}
        onInput={startingAt.inputHandler}
        isInvalid={startingAt.hasError}
        errorMessage={startingAt.errors}
      />
      <Input
        name="endingAt"
        label="Fin"
        type="datetime-local"
        isRequired={true}
        classNames={{
          label: '-mt-4',
        }}
        value={endingAt.value}
        onInput={endingAt.inputHandler}
        isInvalid={endingAt.hasError}
        errorMessage={endingAt.errors}
      />
      {!!formErrors.length && (
        <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
      )}

      <div className="flex justify-end">
        <Button disabled={isConfirmButtonDisabled} type="submit" variant="flat" color="warning">
          Mettre à jour
        </Button>
      </div>
    </form>
  )
}
