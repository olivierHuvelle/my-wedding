import { Card, CardBody } from '@nextui-org/react'

export default function ContactEmptyCard() {
  return (
    <>
      <Card className="my-2 w-full cursor-pointer">
        <CardBody>
          <div className="text-center">Aucun contact pour le moment</div>
        </CardBody>
      </Card>
    </>
  )
}
