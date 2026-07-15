import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { jsonError, assertRateLimit, requireUser } from '@/lib/supabase/auth-helpers'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const metaSchema = z.object({
  application_id: z.string().uuid(),
  lead_id: z.string().trim().max(100).optional().nullable(),
  marketing_id: z.string().trim().max(100).optional().nullable(),
  producer_id: z.string().trim().max(100).optional().nullable(),
})

/** POST multipart: file + application_id (+ optional lead/marketing/producer ids) */
export async function POST(req: NextRequest) {
  const limited = assertRateLimit(`docs:post:${req.headers.get('x-forwarded-for') ?? 'local'}`, 15)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return jsonError('Expected multipart form data.')
  }

  const file = form.get('file')
  if (!(file instanceof File)) {
    return jsonError('Missing file.')
  }

  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    return jsonError('File must be between 1 byte and 10 MB.')
  }

  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return jsonError('Unsupported file type.')
  }

  const meta = metaSchema.safeParse({
    application_id: form.get('application_id'),
    lead_id: form.get('lead_id') || null,
    marketing_id: form.get('marketing_id') || null,
    producer_id: form.get('producer_id') || null,
  })
  if (!meta.success) {
    return jsonError('Invalid application metadata.', 400, meta.error.flatten())
  }

  const supabase = createClient()
  const { data: application, error: appError } = await supabase
    .from('insurance_applications')
    .select('id, user_id')
    .eq('id', meta.data.application_id)
    .maybeSingle()

  if (appError) return jsonError(appError.message, 500)
  const appRow = application as { id: string; user_id: string } | null
  if (!appRow || appRow.user_id !== auth.user.id) {
    return jsonError('Application not found.', 404)
  }

  const safeName = file.name.replace(/[^\w.\-()+ ]+/g, '_').slice(0, 120)
  const storagePath = `${auth.user.id}/${appRow.id}/${Date.now()}-${safeName}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('applications')
    .upload(storagePath, buffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    })

  if (uploadError) {
    return jsonError(uploadError.message, 500)
  }

  const { data: doc, error: docError } = await supabase
    .from('application_documents')
    .insert({
      application_id: appRow.id,
      storage_path: storagePath,
      filename: safeName,
      mime_type: file.type || null,
      lead_id: meta.data.lead_id ?? null,
      marketing_id: meta.data.marketing_id ?? null,
      producer_id: meta.data.producer_id ?? null,
    })
    .select('*')
    .single()

  if (docError) {
    await supabase.storage.from('applications').remove([storagePath])
    return jsonError(docError.message, 500)
  }

  return NextResponse.json({ ok: true, document: doc }, { status: 201 })
}

/** GET ?document_id= — signed URL for own document */
export async function GET(req: NextRequest) {
  const limited = assertRateLimit(`docs:get:${req.headers.get('x-forwarded-for') ?? 'local'}`)
  if (limited) return limited

  const auth = await requireUser()
  if (auth.error) return auth.error

  const documentId = req.nextUrl.searchParams.get('document_id')
  if (!documentId) return jsonError('document_id is required.')

  const supabase = createClient()
  const { data: doc, error } = await supabase
    .from('application_documents')
    .select('id, application_id, storage_path, filename, mime_type, uploaded_at, insurance_applications(user_id)')
    .eq('id', documentId)
    .maybeSingle()

  if (error) return jsonError(error.message, 500)
  if (!doc) return jsonError('Document not found.', 404)

  const related = doc.insurance_applications as
    | { user_id: string }
    | { user_id: string }[]
    | null
  const ownerId = Array.isArray(related) ? related[0]?.user_id : related?.user_id
  if (ownerId !== auth.user.id) {
    return jsonError('Document not found.', 404)
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('applications')
    .createSignedUrl(doc.storage_path, 60)

  if (signError || !signed?.signedUrl) {
    return jsonError(signError?.message || 'Could not create signed URL.', 500)
  }

  return NextResponse.json({
    ok: true,
    url: signed.signedUrl,
    expires_in: 60,
    document: {
      id: doc.id,
      filename: doc.filename,
      mime_type: doc.mime_type,
      uploaded_at: doc.uploaded_at,
    },
  })
}
