# Auth.js + VeilMail Example

A complete authentication example using [Next.js 16](https://nextjs.org), [Auth.js v5](https://authjs.dev), and [VeilMail](https://veilmail.xyz) for transactional email delivery.

## Features

- **Email verification** — New users must verify their email before signing in
- **Password reset** — Forgot password flow with secure token-based reset
- **Two-factor authentication** — Email-based 2FA with 6-digit codes
- **Security notifications** — Emails sent on password change, 2FA enable/disable
- **Welcome email** — Sent after successful email verification
- **OAuth support** — Google and GitHub providers (auto-verifies email)

## Email Flow

| Event | Email Sent | VeilMail Tag |
|-------|-----------|--------------|
| User registers | Verification link | `auth`, `verification` |
| Email verified | Welcome message | `auth`, `welcome` |
| Password reset requested | Reset link | `auth`, `password-reset` |
| Password changed | Security notification | `auth`, `security` |
| 2FA sign-in | 6-digit code | `auth`, `2fa` |
| 2FA enabled | Security notification | `auth`, `2fa`, `security` |
| 2FA disabled | Security notification | `auth`, `2fa`, `security` |

## Setup

### 1. Install dependencies

```bash
cd examples/authjs-nextjs
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="run-npx-auth-secret-to-generate"
VEILMAIL_API_KEY="veil_test_your_key"
VEILMAIL_FROM_EMAIL="noreply@yourdomain.com"
APP_URL="http://localhost:3000"
```

Generate an Auth.js secret:

```bash
npx auth secret
```

### 3. Set up database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth Flow Walkthrough

### Registration

1. User fills out name, email, password at `/register`
2. Server action hashes password, creates user, generates verification token
3. VeilMail sends verification email with a link
4. User clicks link → `/verify-email?token=xxx`
5. Token is validated, `emailVerified` is set, welcome email is sent

### Sign In

1. User enters email/password at `/login`
2. If email not verified → re-sends verification email, shows error
3. If 2FA enabled → generates 6-digit code, sends via VeilMail, redirects to `/verify-2fa`
4. If no 2FA → signs in directly via Auth.js credentials provider

### Password Reset

1. User requests reset at `/reset-password`
2. Server generates token, VeilMail sends reset link
3. User clicks link → `/new-password?token=xxx`
4. User sets new password, security notification email is sent

### Two-Factor Authentication

1. User enables 2FA in `/dashboard/settings`
2. On next sign-in, a 6-digit code is emailed
3. User enters code at `/verify-2fa` along with credentials
4. Code is validated, `TwoFactorConfirmation` record is created
5. Auth.js `signIn` callback checks for confirmation, allows sign-in, deletes confirmation

## Project Structure

```
src/
├── auth.ts                          # Auth.js config with Prisma adapter
├── auth.config.ts                   # Edge-compatible auth config
├── middleware.ts                    # Route protection
├── lib/
│   ├── db.ts                        # Prisma client singleton
│   ├── mail.ts                      # VeilMail email functions
│   └── tokens.ts                    # Token generation utilities
├── components/
│   └── submit-button.tsx            # Form submit button with pending state
└── app/
    ├── layout.tsx
    ├── page.tsx                     # Landing page
    ├── api/auth/[...nextauth]/
    │   └── route.ts                 # Auth.js route handler
    ├── (auth)/
    │   ├── login/                   # Sign in
    │   ├── register/                # Create account
    │   ├── verify-email/            # Email verification
    │   ├── reset-password/          # Request password reset
    │   ├── new-password/            # Set new password
    │   └── verify-2fa/              # 2FA code entry
    └── dashboard/
        ├── page.tsx                 # Protected dashboard
        └── settings/               # 2FA toggle
```

## Key Implementation Details

### VeilMail Integration (`src/lib/mail.ts`)

All emails are sent through the VeilMail SDK with proper tagging and `transactional` type:

```typescript
import { VeilMail } from '@resonia/veilmail-sdk'

const veilmail = new VeilMail(process.env.VEILMAIL_API_KEY!)

await veilmail.emails.send({
  from: 'noreply@yourdomain.com',
  to: email,
  subject: 'Verify your email',
  html: '<p>Click <a href="...">here</a> to verify.</p>',
  tags: ['auth', 'verification'],
  type: 'transactional',
})
```

### Auth.js Configuration (`src/auth.ts`)

- Uses **JWT session strategy** (required for credentials provider)
- **signIn callback** enforces email verification and 2FA
- **linkAccount event** auto-verifies OAuth users
- Supports Google, GitHub, and email/password providers

### Database

Uses SQLite for zero-config local development. Switch to PostgreSQL by changing the `datasource` in `prisma/schema.prisma` and updating `DATABASE_URL`.

## License

MIT
