'use client'

import Link from 'next/link'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { ContactData } from '@/lib/contact-types'
import type { HoursData } from '@/lib/hours-types'
import type { AnnouncementData, AnnouncementStyle } from '@/lib/announcement-types'

/* ──────── Shared helpers ──────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40'

const textareaCls =
  'w-full bg-transparent border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none focus:border-white/40 resize-none'

function SectionHeader({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10"
    >
      <span className="text-sm font-black text-white tracking-wide" style={{ fontFamily: 'var(--font-orbitron)' }}>
        {title}
      </span>
      {open ? <ChevronUp size={15} className="text-white/50" /> : <ChevronDown size={15} className="text-white/50" />}
    </button>
  )
}

function SaveButton({ saving, dirty, onSave, message, error }: {
  saving: boolean; dirty: boolean; onSave: () => void; message: string | null; error: string | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={saving || !dirty}
        className="px-5 py-2 bg-[var(--brand-red)] hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase disabled:opacity-40 transition-colors"
        style={{ fontFamily: 'var(--font-orbitron)' }}
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
      {message && !dirty && <span className="text-xs text-green-400">{message}</span>}
    </div>
  )
}

/* ──────── Contact section ──────── */

function ContactSection({ initial, persistenceBackend }: { initial: ContactData; persistenceBackend: string }) {
  const router = useRouter()
  const [d, setD] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(true)
  const dirty = JSON.stringify(d) !== JSON.stringify(initial)

  const f = (k: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }))
  const addr = (k: keyof ContactData['address']) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setD((prev) => ({ ...prev, address: { ...prev.address, [k]: e.target.value } }))

  const save = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const res = await fetch('/api/admin/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved.'); router.refresh() }
  }, [d, router])

  const msg = persistenceBackend === 'firestore'
    ? 'Saves to Firestore — footer and schema update on next page load.'
    : 'Saves to data/contact.json.'

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden mb-4">
      <SectionHeader title="Contact Details" open={open} onToggle={() => setOpen(o => !o)} />
      {open && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-white/40 mb-2">{msg}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Business Name"><input className={inputCls} value={d.businessName} onChange={f('businessName')} /></Field>
            <Field label="Site URL"><input className={inputCls} value={d.siteUrl} onChange={f('siteUrl')} /></Field>
          </div>
          <Field label="Tagline"><textarea className={textareaCls} rows={2} value={d.tagline} onChange={f('tagline')} /></Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Email"><input type="email" className={inputCls} value={d.email} onChange={f('email')} /></Field>
            <Field label="Phone (optional)"><input type="tel" className={inputCls} value={d.phone} onChange={f('phone')} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Instagram Handle (e.g. @logit.shop)"><input className={inputCls} value={d.instagram} onChange={f('instagram')} /></Field>
            <Field label="Instagram URL"><input type="url" className={inputCls} value={d.instagramUrl} onChange={f('instagramUrl')} /></Field>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Address</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Street"><input className={inputCls} value={d.address.street} onChange={addr('street')} /></Field>
            <Field label="City"><input className={inputCls} value={d.address.city} onChange={addr('city')} /></Field>
            <Field label="County"><input className={inputCls} value={d.address.county} onChange={addr('county')} /></Field>
            <Field label="Postcode"><input className={inputCls} value={d.address.postcode} onChange={addr('postcode')} /></Field>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Legal / Footer</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Company Name"><input className={inputCls} value={d.companyName} onChange={f('companyName')} /></Field>
            <Field label="Company Reg No."><input className={inputCls} value={d.companyRegNumber} onChange={f('companyRegNumber')} /></Field>
          </div>
          <Field label="VAT Info"><input className={inputCls} value={d.vatInfo} onChange={f('vatInfo')} /></Field>
          <Field label="Copyright Line 1"><input className={inputCls} value={d.copyrightLine1} onChange={f('copyrightLine1')} /></Field>
          <Field label="Copyright Line 2"><input className={inputCls} value={d.copyrightLine2} onChange={f('copyrightLine2')} /></Field>
          <SaveButton saving={saving} dirty={dirty} onSave={save} message={message} error={error} />
        </div>
      )}
    </div>
  )
}

/* ──────── Hours section ──────── */

function HoursSection({ initial, persistenceBackend }: { initial: HoursData; persistenceBackend: string }) {
  const router = useRouter()
  const [d, setD] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(true)
  const dirty = JSON.stringify(d) !== JSON.stringify(initial)

  const updateDay = (idx: number, key: string, value: string | boolean) =>
    setD((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s, i) => i === idx ? { ...s, [key]: value } : s),
    }))

  const save = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const res = await fetch('/api/admin/hours', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved.'); router.refresh() }
  }, [d, router])

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden mb-4">
      <SectionHeader title="Business Hours" open={open} onToggle={() => setOpen(o => !o)} />
      {open && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-white/40">{persistenceBackend === 'firestore' ? 'Saves to Firestore.' : 'Saves to data/hours.json.'}</p>
          <div className="space-y-2">
            {d.schedule.map((row, idx) => (
              <div key={row.day} className="grid grid-cols-[80px_1fr_1fr_auto] gap-2 items-center">
                <span className="text-xs text-white/70 font-bold" style={{ fontFamily: 'var(--font-orbitron)' }}>
                  {row.day.slice(0, 3)}
                </span>
                <input
                  type="time"
                  value={row.open}
                  disabled={row.closed}
                  onChange={(e) => updateDay(idx, 'open', e.target.value)}
                  className={`${inputCls} disabled:opacity-30`}
                />
                <input
                  type="time"
                  value={row.close}
                  disabled={row.closed}
                  onChange={(e) => updateDay(idx, 'close', e.target.value)}
                  className={`${inputCls} disabled:opacity-30`}
                />
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-white/50">
                  <input
                    type="checkbox"
                    checked={row.closed}
                    onChange={(e) => updateDay(idx, 'closed', e.target.checked)}
                    className="accent-[var(--brand-red)]"
                  />
                  Closed
                </label>
              </div>
            ))}
          </div>
          <Field label="Notes (optional)">
            <textarea
              className={textareaCls}
              rows={2}
              value={d.notes}
              onChange={(e) => setD((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </Field>
          <SaveButton saving={saving} dirty={dirty} onSave={save} message={message} error={error} />
        </div>
      )}
    </div>
  )
}

/* ──────── Announcement section ──────── */

const STYLES: AnnouncementStyle[] = ['info', 'warning', 'promo']

function AnnouncementSection({ initial, persistenceBackend }: { initial: AnnouncementData; persistenceBackend: string }) {
  const router = useRouter()
  const [d, setD] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(true)
  const dirty = JSON.stringify(d) !== JSON.stringify(initial)

  const f = (k: keyof AnnouncementData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setD((prev) => ({ ...prev, [k]: e.target.value }))

  const save = useCallback(async () => {
    setSaving(true); setError(null); setMessage(null)
    const res = await fetch('/api/admin/announcement', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) { setError(json.error ?? 'Save failed') } else { setMessage('Saved — banner updates on next page load.'); router.refresh() }
  }, [d, router])

  const styleColour: Record<AnnouncementStyle, string> = {
    info:    'border-blue-400/30  bg-blue-500/10',
    warning: 'border-amber-400/30 bg-amber-500/10',
    promo:   'border-[var(--brand-red)]/30 bg-[var(--brand-red-dim)]',
  }

  return (
    <div className="border border-white/15 bg-[var(--charcoal)] rounded-sm overflow-hidden mb-4">
      <SectionHeader title="Announcement Banner" open={open} onToggle={() => setOpen(o => !o)} />
      {open && (
        <div className="p-4 space-y-3">
          <p className="text-xs text-white/40">{persistenceBackend === 'firestore' ? 'Saves to Firestore — banner appears site-wide on next page load.' : 'Saves to data/announcement.json.'}</p>

          {/* Enabled toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={d.enabled}
              onChange={(e) => setD((prev) => ({ ...prev, enabled: e.target.checked }))}
              className="accent-[var(--brand-red)] w-4 h-4"
            />
            <span className="text-sm text-white font-bold">Banner Enabled</span>
          </label>

          <Field label="Message">
            <textarea className={textareaCls} rows={2} value={d.message} onChange={f('message')} placeholder="e.g. Currently taking bookings for June — contact us today!" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Link URL (optional)"><input type="url" className={inputCls} value={d.link} onChange={f('link')} placeholder="https://..." /></Field>
            <Field label="Link Text (optional)"><input className={inputCls} value={d.linkText} onChange={f('linkText')} placeholder="Book now" /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Style">
              <select
                value={d.style}
                onChange={(e) => setD((prev) => ({ ...prev, style: e.target.value as AnnouncementStyle }))}
                className="w-full bg-[var(--charcoal)] border border-white/15 text-white text-sm px-3 py-1.5 focus:outline-none"
              >
                {STYLES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Expires at (optional — leave blank for no expiry)">
              <input type="date" className={inputCls} value={d.expiresAt?.slice(0, 10) ?? ''} onChange={(e) => setD((prev) => ({ ...prev, expiresAt: e.target.value }))} />
            </Field>
          </div>
          {/* Preview */}
          {d.message && (
            <div className={`px-4 py-2.5 border text-sm flex items-center gap-3 ${styleColour[d.style]}`}>
              <span className="text-white/90 flex-1">{d.message}</span>
              {d.linkText && <span className="text-white underline text-xs">{d.linkText}</span>}
            </div>
          )}
          <SaveButton saving={saving} dirty={dirty} onSave={save} message={message} error={error} />
        </div>
      )}
    </div>
  )
}

/* ──────── Page ──────── */

export default function AdminSettingsClient({
  initialContact,
  initialHours,
  initialAnnouncement,
  persistenceBackend,
}: {
  initialContact: ContactData
  initialHours: HoursData
  initialAnnouncement: AnnouncementData
  persistenceBackend: 'firestore' | 'file'
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <div className="mb-8">
        <Link href="/admin" className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors mb-2 inline-block" style={{ fontFamily: 'var(--font-orbitron)' }}>
          ← Admin
        </Link>
        <h1 className="text-2xl font-black text-white mb-1" style={{ fontFamily: 'var(--font-orbitron)' }}>SITE SETTINGS</h1>
        <p className="text-sm text-white/50">Contact details, business hours, and site-wide announcement banner.</p>
      </div>
      <ContactSection initial={initialContact} persistenceBackend={persistenceBackend} />
      <HoursSection initial={initialHours} persistenceBackend={persistenceBackend} />
      <AnnouncementSection initial={initialAnnouncement} persistenceBackend={persistenceBackend} />
    </div>
  )
}
