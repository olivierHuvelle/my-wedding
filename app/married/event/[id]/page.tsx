import { notFound } from 'next/navigation'
import { getEvent } from '@/actions/event'

export default async function EventSinglePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const event = await getEvent(id)
  if (!event) {
    notFound()
  }

  return <section className="m-4">Hello world</section>
}
