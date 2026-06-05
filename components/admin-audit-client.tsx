'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { History, RefreshCw, Undo2 } from 'lucide-react'
import type { CmsAuditListEntry } from '@/lib/cms-audit'
import { CMS_AUDIT_RESOURCE_LABEL } from '@/lib/cms-audit'
import { ConfirmModal } from '@/components/admin-confirm-modal'

interface AuditApiResponse {
  auditEnabled: boolean
  entries: CmsAuditListEntry[]
}

export default function AdminAuditClient({
  auditEnabled: initialAudit,
  auditCollectionId,
}: {
  auditEnabled: boolean
  auditCollectionId: string
}) {
  const [auditEnabled, setAuditEnabled] = useState(initialAudit)
  const [entries, setEntries] = useState<CmsAuditListEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [revertError, setRevertError] = useState<string | null>(null)
  const [revertingId, setRevertingId] = useState<string | null>(null)
  const [confirmRevert, setConfirmRevert] = useState<CmsAuditListEntry | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const r = await fetch('/api/admin/audit')
      const j = (await r.json()) as AuditApiResponse & { error?: string }
      if (!r.ok) {
        setLoadError(j.error || 'Failed to load audit log')
        return
      }
      setAuditEnabled(j.auditEnabled)
      setEntries(j.entries ?? [])
    } catch {
      setLoadError('Network error loading audit log')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const doRevert = async () => {
    if (!confirmRevert) return
    setRevertError(null)
    setRevertingId(confirmRevert.id)
    try {
      const r = await fetch('/api/admin/audit/revert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmRevert.id }),
      })
      const j = (await r.json()) as { ok?: boolean; error?: string }
      if (!r.ok) {
        setRevertError(j.error || 'Revert failed')
        return
      }
      setConfirmRevert(null)
      await load()
    } catch {
      setRevertError('Network error during revert')
    } finally {
      setRevertingId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white mb-4 inline-block"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          ← Admin
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 border border-[var(--brand-red)]/40 flex items-center justify-center shrink-0 bg-[var(--brand-red-dim)]">
              <History className="text-[var(--brand-red)]" size={20} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Change log
              </h1>
              <p className="text-white/55 text-sm max-w-xl">
                Every save from the admin CMS is logged in Firestore with full before and after snapshots. Revert restores the{' '}
                <strong className="text-white/80">previous</strong> snapshot to the live store (Firestore or local JSON, same as your CMS mode).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase border border-white/20 px-4 py-2 hover:bg-white/5 disabled:opacity-40 transition-colors"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

      {!auditEnabled && (
        <div
          className="mb-8 p-4 border border-amber-500/40 bg-amber-500/10 text-sm text-amber-100/90"
          role="status"
        >
          Audit logging requires Firebase Admin (same credentials as Firestore CMS). Configure{' '}
          <code className="text-amber-200/90">FIREBASE_PROJECT_ID</code> and credentials in{' '}
          <code className="text-amber-200/90">.env.local</code>. Entries are stored in the{' '}
          <code className="text-amber-200/90">{auditCollectionId}</code>{' '}
          collection (override with <code className="text-amber-200/90">FIRESTORE_AUDIT_COLLECTION</code>).
        </div>
      )}

      {loadError && (
        <p className="mb-6 text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3">{loadError}</p>
      )}
      {revertError && (
        <p className="mb-6 text-sm text-red-400 border border-red-500/30 bg-red-500/10 px-4 py-3">{revertError}</p>
      )}

      {auditEnabled && loading && entries.length === 0 && (
        <p className="text-white/40 text-sm">Loading audit entries…</p>
      )}

      {auditEnabled && !loading && entries.length === 0 && (
        <p className="text-white/45 text-sm border border-white/10 px-6 py-12 text-center">
          No changes recorded yet. Saves from Gallery, Shop, Services, FAQs, Hero, Reviews, Story, Settings, and Announcement will appear here.
        </p>
      )}

      {auditEnabled && entries.length > 0 && (
        <ul className="space-y-4" role="list">
          {entries.map((entry) => {
            const label = CMS_AUDIT_RESOURCE_LABEL[entry.resource] ?? entry.resource
            const when = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Unknown time'
            const reverted = Boolean(entry.revertedAt)
            return (
              <li
                key={entry.id}
                className="border border-[var(--charcoal-light)] bg-[var(--charcoal)] p-4 md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--brand-red)] mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>
                      {label}
                    </p>
                    <p className="text-sm text-white/70">{when}</p>
                    <p className="text-[10px] text-white/35 font-mono mt-1 break-all">id: {entry.id}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {reverted ? (
                      <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 border border-white/20 text-white/45">
                        Reverted
                        {entry.revertedAt ? ` · ${new Date(entry.revertedAt).toLocaleString()}` : ''}
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={revertingId !== null}
                        onClick={() => setConfirmRevert(entry)}
                        className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-4 py-2 bg-[var(--brand-red)]/90 hover:bg-[var(--brand-red)] text-white disabled:opacity-40 transition-colors"
                        style={{ fontFamily: 'var(--font-orbitron)' }}
                      >
                        <Undo2 size={14} aria-hidden="true" />
                        Revert
                      </button>
                    )}
                  </div>
                </div>

                <details className="group border border-white/10 bg-black/30">
                  <summary className="cursor-pointer px-3 py-2 text-xs font-semibold text-white/70 hover:text-white select-none">
                    Before / after JSON
                  </summary>
                  <div className="grid md:grid-cols-2 gap-0 border-t border-white/10">
                    <div className="border-b md:border-b-0 md:border-r border-white/10 p-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">Previous (restored on revert)</p>
                      <pre className="text-[10px] leading-relaxed text-emerald-200/80 overflow-auto max-h-72 whitespace-pre-wrap break-words">
                        {JSON.stringify(entry.previousData, null, 2)}
                      </pre>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-2">New (saved)</p>
                      <pre className="text-[10px] leading-relaxed text-sky-200/80 overflow-auto max-h-72 whitespace-pre-wrap break-words">
                        {JSON.stringify(entry.newData, null, 2)}
                      </pre>
                    </div>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      )}

      {confirmRevert && (
        <ConfirmModal
          title="Revert this change?"
          description={`Restore “${CMS_AUDIT_RESOURCE_LABEL[confirmRevert.resource]}” to the previous snapshot from ${confirmRevert.createdAt ? new Date(confirmRevert.createdAt).toLocaleString() : 'this entry'}. Newer manual edits to the same area will be overwritten.`}
          confirmLabel="Revert"
          onConfirm={() => void doRevert()}
          onCancel={() => setConfirmRevert(null)}
        />
      )}
    </div>
  )
}
