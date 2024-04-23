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
  Textarea,
  Select,
  SelectItem,
  Checkbox,
  Spinner,
} from '@nextui-org/react'
import { Event, EventGuest, Guest, Menu } from '@prisma/client'
import { GuestCreateInput } from '@/back/models/Guest'
import Alert from '@/components/ui/alert'
import { createGuest, updateGuest } from '@/actions/guest'
import toast from 'react-hot-toast'

interface GuestFormProps {
  guest?:
    | (Guest & {
        events: (EventGuest & { event: Event })[]
      })
    | undefined
  events: Event[]
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
  userId: number
}

export default function GuestForm({ isOpen, onOpenChange, userId, guest, events, onClose }: GuestFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const firstName = useInput(GuestCreateInput.pick({ firstName: true }), 'firstName', guest?.firstName ?? '')
  const lastName = useInput(GuestCreateInput.pick({ lastName: true }), 'lastName', guest?.lastName ?? '')
  const foodProhibitions = useInput(
    GuestCreateInput.pick({ foodProhibitions: true }),
    'foodProhibitions',
    guest?.foodProhibitions ?? '',
  )
  const remark = useInput(GuestCreateInput.pick({ remark: true }), 'remark', guest?.remark ?? '')
  const phone = useInput(GuestCreateInput.pick({ phone: true }), 'phone', guest?.phone ?? '')
  const [menuValue, setMenuValue] = useState<Menu>(guest?.menu ? guest.menu : Menu.Adulte)
  const age = useInput(GuestCreateInput.pick({ age: true }), 'age', guest?.age ? `${guest?.age}` : '', (value) =>
    parseInt(value),
  )
  const [isChild, setIsChild] = useState(guest?.isChild ? guest.isChild : false)
  const [selectedEvents, setSelectedEvents] = useState(new Set(guest?.events.map((event) => `${event.eventId}`)))

  const inputs = useMemo(
    () => [firstName, lastName, foodProhibitions, remark, phone, age],
    [firstName, lastName, foodProhibitions, remark, phone, age],
  )

  const isConfirmButtonDisabled = inputs.some((input) => input.hasError) || isLoading

  const isChildOnchangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChild(e.target.checked)
    if (e.target.checked) {
      setMenuValue(Menu.Enfant)
    } else {
      age.setEnteredValue('')
      setMenuValue(Menu.Adulte)
    }
  }

  const menuChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setMenuValue(e.target.value as Menu)
  }

  const eventChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvents(new Set(e.target.value.split(',')))
  }

  const onCloseHandler = () => {
    inputs.forEach((input) => input.reset())
    setMenuValue(guest?.menu ? guest.menu : Menu.Adulte)
    setIsChild(guest?.isChild ? guest.isChild : false)
    setSelectedEvents(new Set(guest?.events.map((event) => `${event.eventId}`)))
    onClose()
  }

  const reset = () => {
    setFormErrors([])
    inputs.forEach((input) => input.setServerErrors([]))
    if (!guest) {
      inputs.forEach((input) => input.reset())
      setIsChild(false)
      setSelectedEvents(new Set([]))
    }
  }

  const submitHandler = async (formData: FormData) => {
    if (isLoading) {
      return
    }

    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      foodProhibitions: formData.get('foodProhibitions'),
      remark: formData.get('remark'),
      phone: formData.get('phone'),
      age: formData.get('age') ? Number(formData.get('age')) : formData.get('age'),
      isChild,
      menu: menuValue,
      events: selectedEvents,
      userId,
    }

    const result = GuestCreateInput.safeParse(data)

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

    setIsLoading(true)

    const response = guest
      ? await updateGuest(guest, result.data, Array.from(selectedEvents, Number))
      : await createGuest(userId, result.data, Array.from(selectedEvents, Number))

    setTimeout(() => {
      setIsLoading(false)
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
        toast.success(guest ? "L'invité a bien été mis à jour" : "L'invité a bien été créé")
        onOpenChange()
      }
    }, 1000)
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
            <ModalHeader className="flex flex-col gap-1">{`${guest ? 'Modifier' : 'Ajouter'}`} un invité</ModalHeader>
            <ModalBody>
              {!isLoading && (
                <form action={submitHandler} ref={formRef}>
                  <Checkbox isSelected={isChild} onChange={isChildOnchangeHandler} className="my-2" name="isChild">
                    S&apos;agit-il d&apos;un enfant ?
                  </Checkbox>
                  {isChild && (
                    <>
                      <Input
                        name="age"
                        type="number"
                        label="Age"
                        value={age.value}
                        onInput={age.inputHandler}
                        isInvalid={age.hasError}
                        errorMessage={age.errors}
                        onBlur={age.blurHandler}
                      />

                      <Select
                        name="menu"
                        label="Menu"
                        value={guest?.menu}
                        isRequired={true}
                        selectedKeys={[menuValue]}
                        onChange={menuChangeHandler}
                        className="mb-2"
                      >
                        {Object.values(Menu).map((menuOptionValue) => (
                          <SelectItem key={menuOptionValue} value={menuOptionValue}>
                            {menuOptionValue}
                          </SelectItem>
                        ))}
                      </Select>
                    </>
                  )}
                  <Input
                    name="firstName"
                    label="Prénom"
                    isRequired={true}
                    value={firstName.value}
                    onInput={firstName.inputHandler}
                    isInvalid={firstName.hasError}
                    errorMessage={firstName.errors}
                    onBlur={firstName.blurHandler}
                  />
                  <Input
                    name="lastName"
                    label="Nom"
                    isRequired={true}
                    value={lastName.value}
                    onInput={lastName.inputHandler}
                    isInvalid={lastName.hasError}
                    errorMessage={lastName.errors}
                    onBlur={lastName.blurHandler}
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
                    name="phone"
                    label="Téléphone (facultatif)"
                    value={phone.value}
                    onInput={phone.inputHandler}
                    isInvalid={phone.hasError}
                    errorMessage={phone.errors}
                    onBlur={phone.blurHandler}
                  />
                  <Textarea
                    name="remark"
                    label="Remarques"
                    placeholder="Tout ce qui vous semble pertinent !"
                    value={remark.value}
                    onInput={remark.inputHandler}
                    isInvalid={remark.hasError}
                    errorMessage={remark.errors}
                    onBlur={remark.blurHandler}
                  />
                  <Textarea
                    name="foodProhibitions"
                    label="Interdits alimentaires"
                    placeholder="Ex Allergie aux arachides, kasher, arachides kasher 😱"
                    value={foodProhibitions.value}
                    onInput={foodProhibitions.inputHandler}
                    isInvalid={foodProhibitions.hasError}
                    errorMessage={foodProhibitions.errors}
                    onBlur={foodProhibitions.blurHandler}
                  />
                  {!!formErrors.length && (
                    <Alert title="Une erreur s'est produite" content={formErrors} variant="danger" className="my-2" />
                  )}
                </form>
              )}
              {isLoading && <Spinner />}
            </ModalBody>

            <ModalFooter>
              {!isLoading && (
                <>
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
                </>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
