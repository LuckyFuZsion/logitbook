'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'Sign-in failed')
        return
      }
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Sign-in failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md p-8 border border-[var(--charcoal-light)] bg-[var(--charcoal)] space-y-6"
      >
        <div>
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--brand-red)] mb-2"
            style={{ fontFamily: 'var(--font-rajdhani)' }}
          >
            Admin
          </p>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-orbitron)' }}>
            Sign in
          </h1>
          <p className="text-white/50 text-sm mt-2">Manage the image gallery and before / after slider.</p>
        </div>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <label className="block space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-white/70">Username</span>
          <input
            className="w-full px-3 py-2 bg-black/40 border border-white/15 text-white text-sm"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-xs font-bold tracking-widest uppercase text-white/70">Password</span>
          <input
            type="password"
            className="w-full px-3 py-2 bg-black/40 border border-white/15 text-white text-sm"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 bg-[var(--brand-red)] text-white text-xs font-bold tracking-[0.2em] uppercase disabled:opacity-50"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          {pending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
