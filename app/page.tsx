import { SessionService } from '@/back/services/SessionService'
import LoginForm from '@/app/loginForm'
import LogoutForm from '@/app/logoutForm'

export default async function Home() {
  const sessionService = new SessionService()
  const session = await sessionService.getSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoginForm />
      <LogoutForm />
      <div>
        <pre style={{ backgroundColor: 'red', display: 'block' }}>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </main>
  )
}
