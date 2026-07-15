'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { InsuranceApplication } from '@/types/database'

type FormState = {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  date_of_birth: string
  notes: string
}

const empty: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  date_of_birth: '',
  notes: '',
}

const fieldClass =
  'w-full rounded-[10px] border border-[#14432A]/15 bg-[#FAFCFB] px-3.5 py-2.5 font-sans text-[0.9375rem] text-[#14432A] outline-none focus:border-[#14432A]'

export default function InsuranceApplicationPage() {
  const [form, setForm] = useState<FormState>(empty)
  const [applications, setApplications] = useState<InsuranceApplication[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const res = await fetch('/api/applications')
    const json = await res.json()
    if (json.ok) setApplications(json.applications ?? [])
  }

  useEffect(() => {
    void load()
    void fetch('/api/profile')
      .then((r) => r.json())
      .then((json) => {
        if (!json.ok) return
        setForm((prev) => ({
          ...prev,
          first_name: json.profile?.first_name ?? '',
          last_name: json.profile?.last_name ?? '',
          email: json.profile?.email ?? json.user?.email ?? '',
          phone: json.profile?.phone ?? '',
        }))
      })
      .catch(() => undefined)
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.replace(/\D/g, ''),
          notes: form.notes || null,
        }),
      })
      const json = await res.json()
      if (!json.ok) {
        setError(json.error || 'Submission failed.')
        setBusy(false)
        return
      }
      setSelectedId(json.application.id)
      setMessage('Application submitted. You can upload supporting documents below.')
      await load()
    } catch {
      setError('Submission failed.')
    } finally {
      setBusy(false)
    }
  }

  const onUpload = async () => {
    if (!selectedId || !file) {
      setError('Select an application and a file first.')
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)
    try {
      const body = new FormData()
      body.set('file', file)
      body.set('application_id', selectedId)
      const res = await fetch('/api/applications/documents', {
        method: 'POST',
        body,
      })
      const json = await res.json()
      if (!json.ok) {
        setError(json.error || 'Upload failed.')
        setBusy(false)
        return
      }
      setMessage(`Uploaded ${json.document.filename}`)
      setFile(null)
    } catch {
      setError('Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAFCFB]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="m-0 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
          Membership
        </p>
        <h1
          className="mt-2 font-medium text-[#14432A]"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.1rem)',
          }}
        >
          Insurance application
        </h1>
        <p className="mt-2 max-w-xl font-sans text-[0.875rem] text-[#55655D]">
          Securely submit your application. Documents are stored privately and only
          visible to you until an authorized office review.
        </p>
        <p className="mt-2 font-sans text-[0.8125rem]">
          <Link href="/wallet" className="font-semibold text-[#0F3D2E]">
            ← Back to Wallet
          </Link>
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
          {(
            [
              ['first_name', 'First name'],
              ['last_name', 'Last name'],
              ['email', 'Email'],
              ['phone', 'Phone'],
              ['address', 'Address'],
              ['city', 'City'],
              ['state', 'State (2-letter)'],
              ['zip', 'ZIP'],
              ['date_of_birth', 'Date of birth'],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#55655D]">
                {label}
              </span>
              <input
                className={fieldClass}
                type={key === 'date_of_birth' ? 'date' : key === 'email' ? 'email' : 'text'}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                required={key !== 'phone'}
              />
            </label>
          ))}
          <label className="block">
            <span className="mb-1 block font-sans text-[0.75rem] font-semibold text-[#55655D]">
              Notes (optional)
            </span>
            <textarea
              className={fieldClass}
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </label>
          {error ? (
            <p className="m-0 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p>
          ) : null}
          {message ? (
            <p className="m-0 font-sans text-[0.8125rem] text-[#1F7A4D]">{message}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] disabled:opacity-60"
          >
            {busy ? 'Submitting…' : 'Submit application'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
          <h2 className="m-0 font-sans text-[1rem] font-semibold text-[#14432A]">
            Your applications
          </h2>
          <ul className="mt-3 list-none space-y-2 p-0">
            {applications.length === 0 ? (
              <li className="font-sans text-[0.8125rem] text-[#55655D]">No applications yet.</li>
            ) : (
              applications.map((app) => (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(app.id)}
                    className={`w-full rounded-[10px] border px-3 py-2 text-left font-sans text-[0.8125rem] ${
                      selectedId === app.id
                        ? 'border-[#0F3D2E] bg-white'
                        : 'border-[#14432A]/10 bg-[#FAFCFB]'
                    }`}
                  >
                    {app.first_name} {app.last_name} · {app.application_status} ·{' '}
                    {new Date(app.created_at).toLocaleDateString()}
                  </button>
                </li>
              ))
            )}
          </ul>

          <div className="mt-4 space-y-3">
            <p className="m-0 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#55655D]">
              Upload document
            </p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full font-sans text-[0.8125rem] text-[#14432A]"
            />
            <button
              type="button"
              disabled={busy || !selectedId || !file}
              onClick={() => void onUpload()}
              className="rounded-[10px] border border-[#14432A]/25 px-4 py-2 font-sans text-[0.8125rem] font-semibold text-[#14432A] disabled:opacity-50"
            >
              Upload to selected application
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
