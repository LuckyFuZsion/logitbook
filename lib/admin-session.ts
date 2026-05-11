import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE = 'logit_admin_session'
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createSessionToken(username: string): string {
  const body = JSON.stringify({ u: username, exp: Date.now() + MAX_AGE_MS })
  const payload = Buffer.from(body, 'utf8').toString('base64url')
  const sig = sign(payload)
  return `${payload}.${sig}`
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payload, sig] = parts
  try {
    const expected = sign(payload)
    const a = Buffer.from(sig, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
    const json = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      u: string
      exp: number
    }
    if (!json.u || typeof json.exp !== 'number') return null
    if (Date.now() > json.exp) return null
    return json.u
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<string | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  return verifySessionToken(token)
}

export function sessionCookieName() {
  return COOKIE
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  }
}
