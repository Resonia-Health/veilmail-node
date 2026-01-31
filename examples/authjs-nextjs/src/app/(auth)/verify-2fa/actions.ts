'use server'

import { signIn } from '@/auth'
import { db } from '@/lib/db'
import { AuthError } from 'next-auth'

export async function verifyTwoFactor(_prev: unknown, formData: FormData) {
  const code = formData.get('code') as string
  const email = formData.get('email') as string

  if (!code || !email) {
    return { error: 'Code and email are required' }
  }

  const token = await db.twoFactorToken.findFirst({
    where: { email, token: code },
  })

  if (!token) {
    return { error: 'Invalid code' }
  }

  if (new Date(token.expires) < new Date()) {
    return { error: 'Code has expired. Please sign in again.' }
  }

  await db.twoFactorToken.delete({ where: { id: token.id } })

  const user = await db.user.findUnique({ where: { email } })
  if (!user) {
    return { error: 'User not found' }
  }

  // Create 2FA confirmation for the signIn callback
  await db.twoFactorConfirmation.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  })

  // Now sign in — the signIn callback will see the confirmation
  try {
    await signIn('credentials', {
      email,
      password: formData.get('password') as string,
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Authentication failed. Please try again.' }
    }
    throw error
  }

  return {}
}
