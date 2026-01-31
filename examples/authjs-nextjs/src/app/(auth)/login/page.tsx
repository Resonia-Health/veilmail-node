'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { login } from './actions'
import { SubmitButton } from '@/components/submit-button'

export default function LoginPage() {
  const [state, action] = useActionState(login, null)

  if (state?.twoFactor) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-1">Check your email</h1>
          <p className="text-sm text-gray-500 mb-6">
            A verification code has been sent to your email address
          </p>
          <Link
            href="/verify-2fa"
            className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Enter Code
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your credentials to continue
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

          <SubmitButton>Sign In</SubmitButton>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/reset-password"
            className="text-sm text-gray-500 hover:text-black"
          >
            Forgot your password?
          </Link>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-black hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
