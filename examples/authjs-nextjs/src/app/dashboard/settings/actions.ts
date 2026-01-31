'use server'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { sendTwoFactorEnabledEmail, sendTwoFactorDisabledEmail } from '@/lib/mail'

export async function toggleTwoFactor() {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Not authenticated' }
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    return { error: 'User not found' }
  }

  const newValue = !user.isTwoFactorEnabled

  await db.user.update({
    where: { id: user.id },
    data: { isTwoFactorEnabled: newValue },
  })

  // Send security notification
  if (newValue) {
    await sendTwoFactorEnabledEmail(user.email)
  } else {
    await sendTwoFactorDisabledEmail(user.email)

    // Clean up any existing 2FA confirmation
    await db.twoFactorConfirmation.deleteMany({
      where: { userId: user.id },
    })
  }

  return {
    success: newValue
      ? 'Two-factor authentication enabled'
      : 'Two-factor authentication disabled',
    enabled: newValue,
  }
}
