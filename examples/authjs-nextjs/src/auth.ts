import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { db } from '@/lib/db'
import authConfig from './auth.config'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true

      if (!user.id) return false

      const existingUser = await db.user.findUnique({
        where: { id: user.id },
        include: { twoFactorConfirmation: true },
      })

      // Block sign in if email is not verified
      if (!existingUser?.emailVerified) return false

      // Check 2FA
      if (existingUser.isTwoFactorEnabled) {
        const confirmation = existingUser.twoFactorConfirmation

        if (!confirmation) return false

        // Delete confirmation after use (one-time)
        await db.twoFactorConfirmation.delete({
          where: { id: confirmation.id },
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      if (!token.id) return token

      const existingUser = await db.user.findUnique({
        where: { id: token.id as string },
      })

      if (existingUser) {
        token.name = existingUser.name
        token.email = existingUser.email
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      }

      return token
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string
      }

      return session
    },
  },
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  events: {
    async linkAccount({ user }) {
      // Auto-verify email for OAuth users
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
    },
  },
})
