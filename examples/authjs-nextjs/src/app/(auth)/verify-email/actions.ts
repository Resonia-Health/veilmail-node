'use server'

import { db } from '@/lib/db'
import { sendWelcomeEmail } from '@/lib/mail'

export async function verifyEmail(token: string) {
  const existingToken = await db.verificationToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return { error: 'Invalid verification token' }
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: 'Token has expired. Please register again.' }
  }

  const user = await db.user.findUnique({
    where: { email: existingToken.email },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  await db.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  })

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  })

  // Send welcome/success notification
  await sendWelcomeEmail(user.email, user.name || undefined)

  return { success: 'Email verified! You can now sign in.' }
}
