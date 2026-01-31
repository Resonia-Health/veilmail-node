'use client'

import { useState, useTransition } from 'react'
import { toggleTwoFactor } from './actions'

export function TwoFactorToggle({ enabled }: { enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleTwoFactor()

      if (result.error) {
        setMessage(result.error)
        return
      }

      if (result.success) {
        setIsEnabled(result.enabled ?? false)
        setMessage(result.success)
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      {message && (
        <span className="text-xs text-green-600">{message}</span>
      )}
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isEnabled ? 'bg-black' : 'bg-gray-200'
        } ${isPending ? 'opacity-50' : ''}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
