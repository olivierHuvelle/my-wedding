'use client'

import { useState, useMemo, useEffect, useRef, ChangeEvent } from 'react'
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
} from '@nextui-org/react'
import { Event, EventGuest, Guest } from '@prisma/client'
import { GuestCreateInput } from '@/back/models/Guest'
import { isEqual } from 'lodash'
import { GuestFormState } from '@/actions/main'
import Alert from '@/components/ui/alert'
import { Menu } from '@prisma/client'

interface GuestFormProps {
  guest:
    | (Guest & {
        events: (EventGuest & { event: Event })[]
      })
    | undefined
  isOpen: boolean
  onOpenChange: () => void
  userId: number
}

export default function GuestForm({ isOpen, onOpenChange, userId, guest }: GuestFormProps) {
  const [error, setError] = useState<GuestFormState>({
    errors: {
      firstName: [],
      lastName: [],
      isChild: [],
      foodProhibitions: [],
      menu: [],
      zipCode: [],
      number: [],
      phone: [],
      city: [],
      remark: [],
      street: [],
      _form: [],
    },
  })
  const formRef = useRef<HTMLFormElement>(null)

  const firstName = useInput(
    GuestCreateInput.pick({ firstName: true }),
    'firstName',
    guest?.firstName ? guest.firstName : '',
  )
  const lastName = useInput(
    GuestCreateInput.pick({ lastName: true }),
    'lastName',
    guest?.lastName ? guest.lastName : '',
  )
  const foodProhibitions = useInput(
    GuestCreateInput.pick({ foodProhibitions: true }),
    'foodProhibitions',
    guest?.foodProhibitions ? guest.foodProhibitions : '',
  )
  const remark = useInput(GuestCreateInput.pick({ remark: true }), 'remark', guest?.remark ? guest.remark : '')
  const phone = useInput(GuestCreateInput.pick({ phone: true }), 'phone', guest?.phone ? guest.phone : '')
  const city = useInput(GuestCreateInput.pick({ city: true }), 'city', guest?.city ? guest.city : '')
  const number = useInput(GuestCreateInput.pick({ number: true }), 'number', guest?.number ? guest.number : '')
  const street = useInput(GuestCreateInput.pick({ street: true }), 'street', guest?.street ? guest.street : '')
  const zipCode = useInput(GuestCreateInput.pick({ zipCode: true }), 'zipCode', guest?.zipCode ? guest.zipCode : '')
  const [menuValue, setMenuValue] = useState(guest?.menu ? [guest.menu] : [Menu.Adult])
  const [isChild, setIsChild] = useState(guest?.isChild ? guest.isChild : false)

  const inputs = useMemo(
    () => [firstName, lastName, foodProhibitions, remark, phone, city, number, street, zipCode],
    [firstName, lastName, foodProhibitions, remark, phone, city, number, street, zipCode],
  )
  const isConfirmButtonDisabled = !inputs.every((input) => input.isValid)

  const isChildOnchangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChild(e.target.checked)
    if (e.target.checked) {
      setMenuValue([Menu.Child])
    } else {
      setMenuValue([Menu.Adult])
    }
  }

  useEffect(() => {
    inputs.forEach((input) => {
      if (input.hasError && !isEqual(error.errors[input.name as keyof GuestFormState['errors']], input.errors)) {
        setError((prevState) => {
          const newError = { ...prevState }
          newError.errors[input.name as keyof GuestFormState['errors']] = input.errors
          return newError
        })
      } else if (!input.hasError && error.errors[input.name as keyof GuestFormState['errors']].length) {
        setError((prevState) => {
          const newError = { ...prevState }

          if (
            isEqual(
              error.errors[input.name as keyof GuestFormState['errors']],
              prevState.errors[input.name as keyof GuestFormState['errors']],
            )
          ) {
            return prevState
          } else {
            newError.errors[input.name as keyof GuestFormState['errors']] = []
            return newError
          }
        })
      }
    })
  }, [inputs, error])

  const submitHandler = async (formData: FormData) => {
    console.log('formData', formData)
    console.log('userId', userId) // implement me later
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size="xl" scrollBehavior="inside">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modifier un invité</ModalHeader>
            <ModalBody>
              <form action={submitHandler} ref={formRef}>
                <Input
                  name="firstName"
                  label="Prénom"
                  placeholder="John"
                  isRequired={true}
                  value={firstName.value}
                  onInput={firstName.inputHandler}
                  isInvalid={!!error.errors.firstName.length}
                  errorMessage={error.errors.firstName}
                />
                <Input
                  name="lastName"
                  label="Nom"
                  placeholder="Doe"
                  value={lastName.value}
                  onInput={lastName.inputHandler}
                  isInvalid={!!error.errors.lastName.length}
                  errorMessage={error.errors.lastName}
                />
                <Input
                  name="phone"
                  label="Telephone"
                  placeholder="123456789"
                  value={phone.value}
                  onInput={phone.inputHandler}
                  isInvalid={!!error.errors.phone.length}
                  errorMessage={error.errors.phone}
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
                <Textarea
                  name="remark"
                  label="Remarques"
                  placeholder="Tout ce vous semble pertinent !"
                  value={remark.value}
                  onInput={remark.inputHandler}
                  isInvalid={!!error.errors.remark.length}
                  errorMessage={error.errors.remark}
                />
                <Textarea
                  name="foodProhibitions"
                  label="Interdits alimentaires"
                  placeholder="Ex Allergie aux arachides, kasher, arachides kasher"
                  value={foodProhibitions.value}
                  onInput={foodProhibitions.inputHandler}
                  isInvalid={!!error.errors.foodProhibitions.length}
                  errorMessage={error.errors.foodProhibitions}
                />
                <Checkbox isSelected={isChild} onChange={isChildOnchangeHandler}>
                  Enfant ?
                </Checkbox>
                {isChild && (
                  <Select
                    name="menu"
                    label="Menu"
                    value={guest?.menu}
                    isRequired={true}
                    selectedKeys={menuValue}
                    onSelectionChange={setMenuValue}
                  >
                    {Object.values(Menu).map((menuOptionValue) => (
                      <SelectItem key={menuOptionValue} value={menuOptionValue}>
                        {menuOptionValue}
                      </SelectItem>
                    ))}
                  </Select>
                )}
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
