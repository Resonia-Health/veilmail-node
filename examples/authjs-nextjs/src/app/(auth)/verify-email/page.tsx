'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import { verifyEmail } from './actions'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [result, setResult] = useState<{
    error?: string
    success?: string
  } | null>(null)

  const onVerify = useCallback(async () => {
    if (!token) return
    const res = await verifyEmail(token)
    setResult(res)
  }, [token])

  useEffect(() => {
    onVerify()
  }, [onVerify])

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        {!token && (
          <>
            <h1 className="text-2xl font-bold mb-2">Invalid link</h1>
            <p className="text-sm text-gray-500 mb-6">
              No verification token provided.
            </p>
          </>
        )}

        {token && !result && (
          <>
            <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
            <p className="text-sm text-gray-500">
              Please wait while we verify your email.
            </p>
          </>
        )}

        {result?.error && (
          <>
            <h1 className="text-2xl font-bold mb-2">Verification failed</h1>
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-6">
              {result.error}
            </div>
          </>
        )}

        {result?.success && (
          <>
            <h1 className="text-2xl font-bold mb-2">Email verified</h1>
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-600 mb-6">
              {result.success}
            </div>
          </>
        )}

        <Link
          href="/login"
          className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Go to Sign In
        </Link>
      </div>
    </main>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-2">Verifying...</h1>
          <p className="text-sm text-gray-500">Please wait.</p>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
