import LoginForm from '@/components/authentication/login-form'

export default async function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <main className="mb-4 w-full rounded bg-white px-8 pb-8 pt-6 shadow-md md:w-96">
        <h1 className="mb-4 text-center text-2xl">Connexion</h1>
        <LoginForm />
      </main>
    </div>
  )
}
