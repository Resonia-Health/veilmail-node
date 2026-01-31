'use server'

import { signIn } from '@/auth'
import { db } from '@/lib/db'
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens'
import { sendVerificationEmail, sendTwoFactorEmail } from '@/lib/mail'
import { AuthError } from 'next-auth'

export async function login(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await db.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return { error: 'Invalid email or password' }
  }

  // Check if email is verified
  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)
    return { error: 'Email not verified. A new verification email has been sent.' }
  }

  // Check if 2FA is enabled
  if (user.isTwoFactorEnabled) {
    const twoFactorToken = await generateTwoFactorToken(email)
    await sendTwoFactorEmail(email, twoFactorToken.token)
    return { twoFactor: true }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password' }
        default:
          return { error: 'Something went wrong' }
      }
    }
    throw error
  }

  return {}
}
