import { NextAuthOptions, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import paths from '@/utils/paths'
import { loginSchema } from '@/back/models/User'
import { UserService } from '@/back/services/UserService'

export const options: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: paths.login.url,
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      // @ts-expect-error didn't find how to solve the issue
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
  callbacks: {
    jwt: async ({ token, user }) => {
      // @ts-expect-error Message
      user && (token.user = user)
      return token
    },
    session: async ({ session, token }) => {
      if (token?.user) {
        session.user = token.user as unknown as Session['user']
      }
      return session
    },
  },
}
