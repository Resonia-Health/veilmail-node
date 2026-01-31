'use server'

import { db } from '@/lib/db'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'

export async function resetPassword(_prev: unknown, formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const user = await db.user.findUnique({ where: { email } })

  if (!user) {
    // Don't reveal if user exists
    return { success: 'If an account exists with that email, a reset link has been sent.' }
  }

  const resetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(email, resetToken.token)

  return { success: 'If an account exists with that email, a reset link has been sent.' }
}
