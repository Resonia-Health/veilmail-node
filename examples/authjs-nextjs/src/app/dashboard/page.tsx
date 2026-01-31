import { auth, signOut } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/settings"
              className="text-sm text-gray-500 hover:text-black"
            >
              Settings
            </Link>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/' })
              }}
            >
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-black"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
          <dl className="space-y-3">
            <div className="flex gap-4">
              <dt className="text-sm font-medium text-gray-500 w-24">Name</dt>
              <dd className="text-sm">{session.user.name || 'Not set'}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-sm font-medium text-gray-500 w-24">Email</dt>
              <dd className="text-sm">{session.user.email}</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-sm font-medium text-gray-500 w-24">User ID</dt>
              <dd className="text-sm font-mono text-gray-400">{session.user.id}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            You are signed in. Go to{' '}
            <Link href="/dashboard/settings" className="font-medium text-black hover:underline">
              Settings
            </Link>{' '}
            to manage two-factor authentication.
          </p>
        </div>
      </div>
    </main>
  )
}
