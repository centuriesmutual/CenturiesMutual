'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/admin'
import {
  loginSchema,
  resetPasswordRequestSchema,
  signupSchema,
  updatePasswordSchema,
  formatZodError,
} from '@/lib/validation/member'

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.SUPABASE_URL?.replace(/\/$/, '') ||
    'http://localhost:3030'
  )
}

export type AuthActionResult =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> }

function isEmailDeliveryFailure(error: {
  message?: string
  status?: number
  code?: string
} | null) {
  if (!error) return false
  const msg = (error.message || '').toLowerCase()
  return (
    msg.includes('confirmation email') ||
    msg.includes('error sending') ||
    msg.includes('sending confirmation') ||
    msg === '{}' ||
    error.status === 500
  )
}

async function createMemberViaServiceRole(input: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
}): Promise<AuthActionResult> {
  const admin = createServiceClient()
  const { data, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
    },
  })

  if (error) {
    const msg = (error.message || '').toLowerCase()
    if (msg.includes('already') || msg.includes('registered')) {
      return {
        ok: false,
        error: 'An account with this email already exists. Please log in instead.',
      }
    }
    return {
      ok: false,
      error: error.message || 'Could not create your account. Please try again.',
    }
  }

  if (!data.user) {
    return { ok: false, error: 'Could not create your account. Please try again.' }
  }

  return {
    ok: true,
    message:
      'Account created. You can sign in with your email and password.',
  }
}

export async function signUpAction(input: unknown): Promise<AuthActionResult> {
  try {
    const parsed = signupSchema.safeParse(input)
    if (!parsed.success) {
      const fieldErrors = formatZodError(parsed.error)
      const first =
        Object.values(fieldErrors)
          .flat()
          .find((m): m is string => typeof m === 'string' && m.length > 0) ||
        'Please fix the highlighted fields.'
      return {
        ok: false,
        error: first,
        fieldErrors,
      }
    }

    const data = parsed.data
    const supabase = createClient()
    const origin = siteUrl()

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/wallet`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
        },
      },
    })

    if (error) {
      // Supabase project currently fails sending confirmation mail (returns
      // "{}" / 500). Fall back to service-role create with confirmed email so
      // membership signup still works while SMTP is unavailable.
      if (isEmailDeliveryFailure(error)) {
        return createMemberViaServiceRole({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        })
      }

      const message =
        error.message && error.message !== '{}'
          ? error.message
          : 'Could not create your account. Please try again.'
      return { ok: false, error: message }
    }

    // Supabase may return a user with empty identities when the email is already registered.
    if (
      signUpData.user &&
      Array.isArray(signUpData.user.identities) &&
      signUpData.user.identities.length === 0
    ) {
      return {
        ok: false,
        error: 'An account with this email already exists. Please log in instead.',
      }
    }

    return {
      ok: true,
      message:
        'Account created. Check your email to verify your address before signing in.',
    }
  } catch (err) {
    const message =
      err instanceof Error && err.message && err.message !== '{}'
        ? err.message
        : 'Could not create your account. Please try again.'

    // Last-resort path when the client throws AuthRetryableFetchError("{}")
    if (message === '{}' || /retryable|fetch/i.test(String(err))) {
      try {
        const parsed = signupSchema.safeParse(input)
        if (parsed.success) {
          return createMemberViaServiceRole({
            email: parsed.data.email,
            password: parsed.data.password,
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            phone: parsed.data.phone,
          })
        }
      } catch {
        /* fall through */
      }
    }

    return { ok: false, error: message === '{}' ? 'Could not create your account. Please try again.' : message }
  }
}

export async function signInAction(input: unknown): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Invalid email or password.',
      fieldErrors: formatZodError(parsed.error),
    }
  }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error || !data.user) {
    return { ok: false, error: 'Invalid email or password.' }
  }

  if (!data.user.email_confirmed_at) {
    await supabase.auth.signOut()
    return {
      ok: false,
      error:
        'Please verify your email before signing in. Check your inbox for the confirmation link.',
    }
  }

  return { ok: true }
}

export async function signOutAction() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function requestPasswordResetAction(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = resetPasswordRequestSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Enter a valid email address.',
      fieldErrors: formatZodError(parsed.error),
    }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/update-password`,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return {
    ok: true,
    message: 'If an account exists for that email, a reset link has been sent.',
  }
}

export async function updatePasswordAction(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = updatePasswordSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: formatZodError(parsed.error),
    }
  }

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, message: 'Password updated. You can continue to your Wallet.' }
}
