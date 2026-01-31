'use server'

import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendPasswordChangedEmail } from '@/lib/mail'

const NewPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function newPassword(_prev: unknown, formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  if (!token) {
    return { error: 'Missing token' }
  }

  const parsed = NewPasswordSchema.safeParse({ password })
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const existingToken = await db.passwordResetToken.findUnique({
    where: { token },
  })

  if (!existingToken) {
    return { error: 'Invalid reset token' }
  }

  if (new Date(existingToken.expires) < new Date()) {
    return { error: 'Token has expired. Please request a new reset link.' }
  }

  const user = await db.user.findUnique({
    where: { email: existingToken.email },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  })

  // Send security notification
  await sendPasswordChangedEmail(user.email)

  return { success: 'Password updated! You can now sign in.' }
}
