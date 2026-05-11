import { NextResponse } from 'next/server'
import {
  createSessionToken,
  sessionCookieName,
  sessionCookieOptions,
} from '@/lib/admin-session'

export async function POST(req: Request) {
  let body: { username?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const user = process.env.ADMIN_USERNAME
  const pass = process.env.ADMIN_PASSWORD
  if (!user || !pass) {
    return NextResponse.json(
      { error: 'Admin credentials are not configured on the server.' },
      { status: 500 },
    )
  }

  if (body.username !== user || body.password !== pass) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
  }

  let token: string
  try {
    token = createSessionToken(user)
  } catch {
    return NextResponse.json(
      { error: 'Missing ADMIN_SESSION_SECRET on the server.' },
      { status: 500 },
    )
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(sessionCookieName(), token, sessionCookieOptions())
  return res
}
