import { Card, CardBody } from '@nextui-org/react'

export default function NotificationEmptyCard() {
  return (
    <>
      <Card className="my-2 w-full cursor-pointer">
        <CardBody>
          <div className="text-center">Aucune notification pour le moment</div>
        </CardBody>
      </Card>
    </>
  )
}
