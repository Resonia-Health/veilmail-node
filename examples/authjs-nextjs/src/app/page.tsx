import Link from 'next/link'
import { auth } from '@/auth'

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AuthJS + VeilMail
        </h1>
        <p className="text-gray-500 mb-8">
          Email verification, password reset, and 2FA powered by VeilMail
        </p>

        {session ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Signed in as <strong>{session.user?.email}</strong>
            </p>
            <Link
              href="/dashboard"
              className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              href="/login"
              className="inline-block w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Create Account
            </Link>
          </div>
        )}

        <div className="mt-12 rounded-lg border border-gray-100 bg-gray-50 p-4 text-left">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            This example demonstrates
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              Email verification on registration
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              Password reset via email
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              Two-factor authentication (email-based)
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-green-500">&#10003;</span>
              Welcome &amp; security notification emails
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
