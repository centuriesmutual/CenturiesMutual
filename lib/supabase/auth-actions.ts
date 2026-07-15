'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
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

function readableAuthError(error: {
  message?: string
  status?: number
  code?: string
} | null): string {
  if (!error) return 'Could not create your account. Please try again.'

  const msg = (error.message || '').trim()
  const lower = msg.toLowerCase()

  if (
    lower.includes('confirmation email') ||
    lower.includes('error sending') ||
    lower.includes('sending confirmation') ||
    msg === '{}' ||
    error.status === 500
  ) {
    return 'We could not send your verification email. Please try again in a few minutes. If this continues, contact support — email delivery must be working before you can verify and sign in.'
  }

  if (msg && msg !== '{}') return msg
  return 'Could not create your account. Please try again.'
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
      return { ok: false, error: readableAuthError(error) }
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

    // Require email confirmation — never treat an unconfirmed user as fully registered.
    if (signUpData.user && !signUpData.user.email_confirmed_at) {
      return {
        ok: true,
        message:
          'Account created. Check your email for a verification link before signing in.',
      }
    }

    if (signUpData.user?.email_confirmed_at) {
      // Project has confirm-email disabled; still nudge login rather than auto-wallet.
      return {
        ok: true,
        message:
          'Account created. You can sign in with your email and password.',
      }
    }

    return {
      ok: true,
      message:
        'Account created. Check your email for a verification link before signing in.',
    }
  } catch (err) {
    if (err && typeof err === 'object' && 'message' in err) {
      return {
        ok: false,
        error: readableAuthError(err as { message?: string; status?: number }),
      }
    }
    return {
      ok: false,
      error: 'Could not create your account. Please try again.',
    }
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
