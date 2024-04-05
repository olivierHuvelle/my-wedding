import Link from 'next/link'
import Image from 'next/image'
import NotFoundImage1 from '@/public/404-1.png'
import NotFoundImage2 from '@/public/404-2.png'

export default function NotFoundPage() {
  return (
    <main className="flex flex-col-reverse items-center justify-center gap-16 px-4 py-24 md:gap-28 md:px-44 md:py-20 lg:flex-row lg:px-24 lg:py-24">
      <div className="relative w-full pb-12 lg:pb-0 xl:w-1/2 xl:pt-24">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-2xl font-bold text-gray-800">Vous avez trouvé une page introuvable :)</h1>
              <p className="mb-6 mt-2 text-gray-800">Retour en terra cognita !</p>
              <Link
                href="/"
                className="md my-2 rounded  border bg-indigo-600 px-8 py-4 text-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50 sm:w-full lg:w-auto"
              >
                Take me home!
              </Link>
            </div>
          </div>
          <div>
            <Image src={NotFoundImage2} alt="image 404" />
          </div>
        </div>
      </div>
      <div>
        <Image src={NotFoundImage1} alt="image of electrical wire disconnected" />
      </div>
    </main>
  )
}
