import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { TwoFactorToggle } from './two-factor-toggle'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { isTwoFactorEnabled: true, password: true },
  })

  const hasPassword = !!user?.password

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-black">
              Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-1">Security</h2>
          <p className="text-sm text-gray-500 mb-6">
            Manage your account security settings
          </p>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Two-factor authentication</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {hasPassword
                    ? 'Receive a verification code via email when you sign in'
                    : 'Only available for password-based accounts'}
                </p>
              </div>
              {hasPassword && (
                <TwoFactorToggle enabled={user?.isTwoFactorEnabled ?? false} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
