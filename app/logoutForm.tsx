import { logout } from '@/actions/authentication'

export default function LogoutForm() {
  return (
    <form action={logout}>
      <button type={'submit'}>Logout</button>
    </form>
  )
}
