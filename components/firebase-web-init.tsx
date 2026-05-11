'use client'

import { useEffect } from 'react'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import {
  getFirebaseClientConfig,
  isFirebaseAnalyticsEnabled,
  isFirebaseWebSdkEnabled,
} from '@/lib/firebase-client-config'

/**
 * Initializes Firebase Web SDK + Google Analytics in the browser only.
 * Add NEXT_PUBLIC_FIREBASE_* to .env.local (see .env.example). No render output.
 * Set NEXT_PUBLIC_FIREBASE_ANALYTICS=0 or NEXT_PUBLIC_FIREBASE_WEB=0 to avoid browser calls when fixing API keys.
 */
export function FirebaseWebInit() {
  useEffect(() => {
    if (!isFirebaseWebSdkEnabled()) return
    const config = getFirebaseClientConfig()
    if (!config) return
    if (!isFirebaseAnalyticsEnabled()) return

    const app = getApps().length > 0 ? getApp() : initializeApp(config)

    void (async () => {
      try {
        if (await isSupported()) {
          getAnalytics(app)
        }
      } catch {
        // Analytics unavailable (e.g. blocked, unsupported environment)
      }
    })()
  }, [])

  return null
}
