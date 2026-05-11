import type { FirebaseOptions } from 'firebase/app'

function publicEnv(value: string | undefined): string | undefined {
  if (value == null) return undefined
  let s = value.replace(/\r/g, '').trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s || undefined
}

/**
 * Browser Firebase config from env (NEXT_PUBLIC_*). Safe to expose; restrict domains in Google Cloud Console.
 * Returns null if required vars are missing — Analytics component becomes a no-op.
 */
export function getFirebaseClientConfig(): FirebaseOptions | null {
  const apiKey = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  const authDomain = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
  const projectId = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  const storageBucket = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  const messagingSenderId = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
  const appId = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
  const measurementId = publicEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID)

  if (!apiKey || !authDomain || !projectId || !messagingSenderId || !appId) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: storageBucket || undefined,
    messagingSenderId,
    appId,
    measurementId: measurementId || undefined,
  }
}

/** When false, skip loading Firebase Analytics (avoids config-fetch noise while fixing API keys). */
export function isFirebaseAnalyticsEnabled(): boolean {
  return publicEnv(process.env.NEXT_PUBLIC_FIREBASE_ANALYTICS) !== '0'
}

/** When false, do not call initializeApp in the browser (no Installations / Analytics). */
export function isFirebaseWebSdkEnabled(): boolean {
  return publicEnv(process.env.NEXT_PUBLIC_FIREBASE_WEB) !== '0'
}
