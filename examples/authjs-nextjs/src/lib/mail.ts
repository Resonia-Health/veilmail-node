import { VeilMail } from '@resonia/veilmail-sdk'

const veilmail = new VeilMail(process.env.VEILMAIL_API_KEY!)
const fromEmail = process.env.VEILMAIL_FROM_EMAIL || 'noreply@veilmail.xyz'
const appUrl = process.env.APP_URL || 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`

  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">Verify your email</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 24px;">
          Click the button below to verify your email address and activate your account.
        </p>
        <a href="${verifyUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Verify Email
        </a>
        <p style="font-size: 13px; color: #999; margin-top: 24px; line-height: 1.5;">
          If you didn't create an account, you can safely ignore this email.
          This link expires in 1 hour.
        </p>
      </div>
    `,
    tags: ['auth', 'verification'],
    type: 'transactional',
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/new-password?token=${token}`

  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Reset your password',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">Reset your password</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 24px;">
          Someone requested a password reset for your account. Click the button below to choose a new password.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Reset Password
        </a>
        <p style="font-size: 13px; color: #999; margin-top: 24px; line-height: 1.5;">
          If you didn't request this, you can safely ignore this email.
          This link expires in 1 hour.
        </p>
      </div>
    `,
    tags: ['auth', 'password-reset'],
    type: 'transactional',
  })
}

export async function sendTwoFactorEmail(email: string, code: string) {
  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: `${code} is your verification code`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">Two-factor authentication</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 24px;">
          Enter the following code to complete your sign in:
        </p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111;">${code}</span>
        </div>
        <p style="font-size: 13px; color: #999; line-height: 1.5;">
          This code expires in 5 minutes. If you didn't try to sign in, please secure your account immediately.
        </p>
      </div>
    `,
    tags: ['auth', '2fa'],
    type: 'transactional',
  })
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Welcome to the platform!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">Welcome${name ? `, ${name}` : ''}!</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 24px;">
          Your email has been verified and your account is now active. You're all set to get started.
        </p>
        <a href="${appUrl}/dashboard" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Go to Dashboard
        </a>
      </div>
    `,
    tags: ['auth', 'welcome'],
    type: 'transactional',
  })
}

export async function sendPasswordChangedEmail(email: string) {
  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Your password was changed',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">Password changed</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5; margin-bottom: 24px;">
          Your password was successfully changed. If you didn't make this change, please reset your password immediately or contact support.
        </p>
        <a href="${appUrl}/reset-password" style="display: inline-block; background: #dc2626; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Reset Password
        </a>
      </div>
    `,
    tags: ['auth', 'security'],
    type: 'transactional',
  })
}

export async function sendTwoFactorEnabledEmail(email: string) {
  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Two-factor authentication enabled',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">2FA enabled</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Two-factor authentication has been enabled on your account. You'll receive a verification code via email each time you sign in.
        </p>
        <p style="font-size: 13px; color: #999; margin-top: 24px; line-height: 1.5;">
          If you didn't make this change, please secure your account immediately.
        </p>
      </div>
    `,
    tags: ['auth', '2fa', 'security'],
    type: 'transactional',
  })
}

export async function sendTwoFactorDisabledEmail(email: string) {
  await veilmail.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Two-factor authentication disabled',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 16px;">2FA disabled</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Two-factor authentication has been disabled on your account. Your account is now less secure.
        </p>
        <p style="font-size: 13px; color: #999; margin-top: 24px; line-height: 1.5;">
          If you didn't make this change, please secure your account immediately.
        </p>
      </div>
    `,
    tags: ['auth', '2fa', 'security'],
    type: 'transactional',
  })
}
