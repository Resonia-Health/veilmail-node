'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useActionState } from 'react'
import { Suspense } from 'react'
import { newPassword } from './actions'
import { SubmitButton } from '@/components/submit-button'

function NewPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, action] = useActionState(newPassword, null)

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid link</h1>
          <p className="text-sm text-gray-500 mb-6">
            No reset token provided.
          </p>
          <Link
            href="/reset-password"
            className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Request New Link
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Set new password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Choose a new password for your account
        </p>

        <form action={action} className="space-y-4">
          <input type="hidden" name="token" value={token} />

          {state?.error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600">
              {state.success}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400"
              placeholder="At least 8 characters"
            />
          </div>

          <SubmitButton>Update Password</SubmitButton>
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

export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    }>
      <NewPasswordForm />
    </Suspense>
  )
}
