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

export async function signUpAction(input: unknown): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: 'Please fix the highlighted fields.',
      fieldErrors: formatZodError(parsed.error),
    }
  }

  const data = parsed.data
  const supabase = createClient()
  const origin = siteUrl()

  const { error } = await supabase.auth.signUp({
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
    return { ok: false, error: error.message }
  }

  return {
    ok: true,
    message:
      'Account created. Check your email to verify your address before signing in.',
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
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { ok: false, error: error.message }
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
