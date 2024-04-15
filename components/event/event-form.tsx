'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import useInput from '@/hooks/use-input'
import { Modal, ModalHeader, ModalFooter, ModalContent, ModalBody, Button, Input } from '@nextui-org/react'
import { Event } from '@prisma/client'
import { EventFormState } from '@/actions/main'
import { EventCreateInput } from '@/back/models/Event'
import { isEqual } from 'lodash'
import Alert from '@/components/ui/alert'
import { updateEvent } from '@/actions/event'
import { createEmptyEventFormState } from '@/actions/main'

interface EventFormProps {
  event: Event
  isOpen: boolean
  onOpenChange: () => void
}

export default function EventForm({ event, isOpen, onOpenChange }: EventFormProps) {
  const [error, setError] = useState<EventFormState>(createEmptyEventFormState())
  const formRef = useRef<HTMLFormElement>(null)
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
  const isConfirmButtonDisabled = !inputs.every((input) => input.isValid)

  useEffect(() => {
    inputs.forEach((input) => {
      if (input.hasError && !isEqual(error.errors[input.name as keyof EventFormState['errors']], input.errors)) {
        setError((prevState) => {
          const newError = { ...prevState }
          newError.errors[input.name as keyof EventFormState['errors']] = input.errors
          return newError
        })
      } else if (!input.hasError && error.errors[input.name as keyof EventFormState['errors']].length) {
        setError((prevState) => {
          const newError = { ...prevState }

          if (
            isEqual(
              error.errors[input.name as keyof EventFormState['errors']],
              prevState.errors[input.name as keyof EventFormState['errors']],
            )
          ) {
            return prevState
          } else {
            newError.errors[input.name as keyof EventFormState['errors']] = []
            return newError
          }
        })
      }
    })
  }, [inputs, error])

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
    const formattedError = createEmptyEventFormState()
    const result = EventCreateInput.safeParse(data)
    if (!result.success) {
      formattedError.errors = {
        ...formattedError.errors,
        ...result.error.flatten().fieldErrors,
      }
      setError(formattedError)
      return
    }

    const response = await updateEvent(event, result.data)

    setError((prevError) => ({
      ...prevError,
      errors: { ...response.errors },
    }))

    const hasErrors = Object.values(response.errors).some((errorArray) => errorArray.length > 0)

    if (!hasErrors) {
      onOpenChange()
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modifier un événement</ModalHeader>
            <ModalBody>
              <form action={submitHandler} ref={formRef}>
                <Input
                  name="name"
                  label="Nom"
                  placeholder="Exemple"
                  isRequired={true}
                  value={name.value}
                  onInput={name.inputHandler}
                  isInvalid={!!error.errors.name.length}
                  errorMessage={error.errors.name}
                />
                <Input
                  name="city"
                  label="Ville"
                  placeholder="Arlon"
                  isRequired={true}
                  value={city.value}
                  onInput={city.inputHandler}
                  isInvalid={!!error.errors.city.length}
                  errorMessage={error.errors.city}
                />
                <Input
                  name="number"
                  label="Numéro"
                  placeholder="1"
                  isRequired={true}
                  value={number.value}
                  onInput={number.inputHandler}
                  isInvalid={!!error.errors.number.length}
                  errorMessage={error.errors.number}
                />
                <Input
                  name="street"
                  label="Rue"
                  placeholder="1"
                  isRequired={true}
                  value={street.value}
                  onInput={street.inputHandler}
                  isInvalid={!!error.errors.street.length}
                  errorMessage={error.errors.street}
                />
                <Input
                  name="zipCode"
                  label="Code postal"
                  placeholder="6740"
                  isRequired={true}
                  value={zipCode.value}
                  onInput={zipCode.inputHandler}
                  isInvalid={!!error.errors.zipCode.length}
                  errorMessage={error.errors.zipCode}
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
                  isInvalid={!!error.errors.startingAt.length}
                  errorMessage={error.errors.startingAt}
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
                  isInvalid={!!error.errors.endingAt.length}
                  errorMessage={error.errors.endingAt}
                />
                {!!error.errors._form.length && (
                  <Alert
                    title="Une erreur s'est produite"
                    content={error.errors._form}
                    variant="danger"
                    className="mb-2"
                  />
                )}
              </form>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  formRef.current && formRef.current.requestSubmit()
                }}
                disabled={isConfirmButtonDisabled}
              >
                Valider
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
