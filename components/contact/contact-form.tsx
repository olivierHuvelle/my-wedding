'use client'

import { useState, useMemo, useRef, ChangeEvent } from 'react'
import useInput from '@/hooks/use-input'
import {
  Modal,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import Alert from '@/components/ui/alert'
import { Contact, Event } from '@prisma/client'
import { ContactCreateInput } from '@/back/models/Contact'
import { ContactWithEvents } from '@/app/married/event/[id]/page'
import { updateContact, createContact } from '@/actions/contact'
import toast from 'react-hot-toast'

interface ContactFormProps {
  contactWithEvents?: ContactWithEvents
  events: Event[]
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}

export default function ContactForm({ isOpen, onOpenChange, onClose, contactWithEvents, events }: ContactFormProps) {
  const contact = contactWithEvents?.contact

  const formRef = useRef<HTMLFormElement>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const firstName = useInput(ContactCreateInput.pick({ firstName: true }), 'firstName', contact?.firstName ?? '')
  const lastName = useInput(ContactCreateInput.pick({ lastName: true }), 'lastName', contact?.lastName ?? '')
  const phone = useInput(ContactCreateInput.pick({ phone: true }), 'phone', contact?.phone ?? '')
  const email = useInput(ContactCreateInput.pick({ email: true }), 'email', contact?.email ?? '')
  const job = useInput(ContactCreateInput.pick({ job: true }), 'job', contact?.job ?? '')
  const remark = useInput(ContactCreateInput.pick({ remark: true }), 'remark', contact?.remark ?? '')
  const [selectedEvents, setSelectedEvents] = useState(
    new Set(contactWithEvents?.events.map((eventId) => `${eventId}`)),
  )

  const inputs = useMemo(
    () => [firstName, lastName, phone, email, job, remark],
    [firstName, lastName, phone, email, job, remark],
  )

  const isConfirmButtonDisabled = inputs.some((input) => input.hasError) || selectedEvents.size === 0

  const eventChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvents(new Set(e.target.value.split(',')))
  }

  const onCloseHandler = () => {
    inputs.forEach((input) => input.reset())
    setSelectedEvents(new Set(contactWithEvents?.events.map((eventId) => `${eventId}`)))
    onClose()
  }

  const reset = () => {
    setFormErrors([])
    inputs.forEach((input) => input.setServerErrors([]))
  }

  const submitHandler = async (formData: FormData) => {
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      job: formData.get('job'),
      zipCode: formData.get('zipCode'),
      number: formData.get('number'),
      street: formData.get('street'),
      city: formData.get('city'),
      remark: formData.get('remark'),
    }

    const result = ContactCreateInput.safeParse(data)

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

    const response = contactWithEvents
      ? await updateContact(contact as Contact, result.data, Array.from(selectedEvents, Number))
      : await createContact(result.data, Array.from(selectedEvents, Number))

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
      toast.success(contact ? 'Le contact a bien été mis à jour' : 'Le contact a bien été créé')
      onOpenChange()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="xl"
      scrollBehavior="inside"
      onClose={onCloseHandler}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {`${contactWithEvents ? 'Modifier' : 'Ajouter'}`} un contact
            </ModalHeader>
            <ModalBody>
              <form action={submitHandler} ref={formRef}>
                <Input
                  name="firstName"
                  label="Prénom"
                  placeholder="John"
                  value={firstName.value}
                  onInput={firstName.inputHandler}
                  isInvalid={firstName.hasError}
                  errorMessage={firstName.errors}
                  onBlur={firstName.blurHandler}
                />
                <Input
                  name="lastName"
                  label="Nom"
                  placeholder="Doe"
                  value={lastName.value}
                  onInput={lastName.inputHandler}
                  isInvalid={lastName.hasError}
                  errorMessage={lastName.errors}
                  onBlur={lastName.blurHandler}
                />
                <Input
                  name="phone"
                  label="Telephone"
                  placeholder="123456789"
                  value={phone.value}
                  onInput={phone.inputHandler}
                  isInvalid={phone.hasError}
                  errorMessage={phone.errors}
                  onBlur={phone.blurHandler}
                />
                <Input
                  name="email"
                  label="Email"
                  placeholder="john.doe@gmail.com"
                  value={email.value}
                  onInput={email.inputHandler}
                  isInvalid={email.hasError}
                  errorMessage={email.errors}
                  onBlur={email.blurHandler}
                />
                <Select
                  name="events"
                  label="Événements"
                  isRequired={true}
                  selectionMode="multiple"
                  placeholder="Sélectionnez un ou plusieurs événements"
                  className="mb-2"
                  selectedKeys={selectedEvents}
                  onChange={eventChangeHandler}
                >
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  name="job"
                  label="Métier"
                  placeholder="ex: restaurateur"
                  value={job.value}
                  onInput={job.inputHandler}
                  isInvalid={job.hasError}
                  errorMessage={job.errors}
                  onBlur={job.blurHandler}
                />
                <Textarea
                  name="remark"
                  label="Remarques"
                  placeholder="Tout ce vous semble pertinent !"
                  value={remark.value}
                  onInput={remark.inputHandler}
                  isInvalid={remark.hasError}
                  errorMessage={remark.errors}
                  onBlur={remark.blurHandler}
                />

                {!!formErrors.length && (
                  <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
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
                isDisabled={isConfirmButtonDisabled}
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
