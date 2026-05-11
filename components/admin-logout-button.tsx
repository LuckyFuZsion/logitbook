'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLogoutButton() {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        try {
          await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
          router.push('/admin/login')
          router.refresh()
        } finally {
          setPending(false)
        }
      }}
      className="text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white border border-white/15 px-4 py-2 transition-colors disabled:opacity-50"
      style={{ fontFamily: 'var(--font-orbitron)' }}
    >
      {pending ? 'Signing out...' : 'Log out'}
    </button>
  )
}
