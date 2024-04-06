import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserService } from '@/back/services/UserService'
import { loginSchema } from '@/back/models/User'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const result = loginSchema.safeParse(credentials)
        if (!result.success) {
          return null
        }

        const userService = new UserService()
        try {
          return await userService.findUserByEmailAndPassword(result.data.email, result.data.password)
        } catch (err: unknown) {
          return null
        }
      },
    }),
  ],
})

export { handler as GET, handler as POST }
