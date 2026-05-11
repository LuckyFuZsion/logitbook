import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { cert, applicationDefault, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

function initFromServiceAccountFile(envPath: string): boolean {
  const abs = resolve(process.cwd(), envPath)
  if (!existsSync(abs)) return false
  const sa = JSON.parse(readFileSync(abs, 'utf8')) as {
    project_id?: string
    client_email?: string
    private_key?: string
  }
  if (!sa.project_id || !sa.client_email || !sa.private_key) {
    throw new Error('Service account JSON missing project_id, client_email, or private_key')
  }
  initializeApp({
    credential: cert({
      projectId: sa.project_id,
      clientEmail: sa.client_email,
      privateKey: sa.private_key.replace(/\\n/g, '\n'),
    }),
    projectId: sa.project_id,
  })
  return true
}

/** Firestore collection for CMS docs (`gallery`, `store`). Override with FIRESTORE_CMS_COLLECTION. */
export function getCmsCollectionId(): string {
  return process.env.FIRESTORE_CMS_COLLECTION?.trim() || 'cms'
}

let cachedDb: Firestore | null | undefined

function initApp() {
  if (getApps().length > 0) return

  const projectId = process.env.FIREBASE_PROJECT_ID?.trim()
  const jsonRaw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim()

  if (jsonRaw) {
    const cred = JSON.parse(jsonRaw) as {
      project_id?: string
      client_email?: string
      private_key?: string
    }
    const pid = cred.project_id || projectId
    if (!pid || !cred.client_email || !cred.private_key) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON missing project_id, client_email, or private_key')
    }
    initializeApp({
      credential: cert({
        projectId: pid,
        clientEmail: cred.client_email,
        privateKey: cred.private_key.replace(/\\n/g, '\n'),
      }),
      projectId: pid,
    })
    return
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim()
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY?.trim()
  if (projectId && clientEmail && privateKeyRaw) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
      }),
      projectId,
    })
    return
  }

  const saPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim()
  if (saPath) {
    if (!initFromServiceAccountFile(saPath)) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_PATH not found (resolved from project dir): ${resolve(process.cwd(), saPath)}`,
      )
    }
    return
  }

  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()
  if (gac) {
    if (initFromServiceAccountFile(gac)) return
    initializeApp({ credential: applicationDefault() })
    return
  }

  if (process.env.FIREBASE_USE_ADC === 'true') {
    initializeApp({ credential: applicationDefault() })
    return
  }

  throw new Error('No Firebase Admin credentials configured')
}

/**
 * Firestore instance for server-side CMS, or null when Firebase env is not set.
 * Uses Firebase Admin (bypasses security rules; keep rules locked for client SDKs).
 */
export function getFirestoreDb(): Firestore | null {
  if (cachedDb !== undefined) {
    return cachedDb
  }
  try {
    initApp()
    const app = getApps()[0]
    if (!app) {
      cachedDb = null
      return null
    }
    cachedDb = getFirestore(app)
    return cachedDb
  } catch (e) {
    console.warn('[firebase-admin] Firestore not active:', e instanceof Error ? e.message : e)
    cachedDb = null
    return null
  }
}

export function isFirestorePersistenceEnabled(): boolean {
  return getFirestoreDb() !== null
}
