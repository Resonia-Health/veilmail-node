import crypto from 'crypto'
import { db } from './db'

export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

  const existing = await db.verificationToken.findFirst({ where: { email } })
  if (existing) {
    await db.verificationToken.delete({ where: { id: existing.id } })
  }

  return db.verificationToken.create({
    data: { email, token, expires },
  })
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

  const existing = await db.passwordResetToken.findFirst({ where: { email } })
  if (existing) {
    await db.passwordResetToken.delete({ where: { id: existing.id } })
  }

  return db.passwordResetToken.create({
    data: { email, token, expires },
  })
}

export async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 999_999).toString()
  const expires = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  const existing = await db.twoFactorToken.findFirst({ where: { email } })
  if (existing) {
    await db.twoFactorToken.delete({ where: { id: existing.id } })
  }

  return db.twoFactorToken.create({
    data: { email, token, expires },
  })
}
