'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { verifyTwoFactor } from './actions'
import { SubmitButton } from '@/components/submit-button'

export default function Verify2FAPage() {
  const [state, action] = useActionState(verifyTwoFactor, null)

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Two-factor authentication</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form action={action} className="space-y-4">
          {state?.error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              placeholder="Your password"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium mb-1.5">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-center tracking-[0.3em] font-mono text-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              placeholder="000000"
            />
          </div>

          <SubmitButton>Verify &amp; Sign In</SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium text-black hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}
