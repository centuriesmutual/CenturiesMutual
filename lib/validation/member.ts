import { z } from 'zod'

const EMAIL = z
  .string()
  .trim()
  .email('Please enter a valid email address.')
  .max(254)

const PHONE = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 0 || v.length === 10, {
    message: 'Please enter a 10-digit phone number.',
  })

const ZIP = z
  .string()
  .trim()
  .regex(/^\d{5}(-\d{4})?$/, 'Enter a valid US ZIP code.')

const DOB = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD.')
  .refine((v) => {
    const d = new Date(v + 'T00:00:00Z')
    if (Number.isNaN(d.getTime())) return false
    const now = new Date()
    const age =
      (now.getTime() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    return age >= 0 && age <= 120
  }, 'Enter a valid date of birth.')

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required.').max(40),
    lastName: z.string().trim().min(1, 'Last name is required.').max(40),
    email: EMAIL,
    phone: PHONE,
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((v) => v === true, {
      message: 'Please agree to the Terms and Privacy Policy.',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: EMAIL,
  password: z.string().min(1, 'Password is required.'),
})

export const resetPasswordRequestSchema = z.object({
  email: EMAIL,
})

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const profileUpdateSchema = z.object({
  first_name: z.string().trim().min(1).max(40).optional(),
  last_name: z.string().trim().min(1).max(40).optional(),
  phone: PHONE.optional(),
})

export const insuranceApplicationSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(40),
  last_name: z.string().trim().min(1, 'Last name is required.').max(40),
  email: EMAIL,
  phone: PHONE.optional(),
  address: z.string().trim().min(1, 'Address is required.').max(200),
  city: z.string().trim().min(1, 'City is required.').max(80),
  state: z
    .string()
    .trim()
    .length(2, 'State must be a 2-letter code.')
    .transform((v) => v.toUpperCase()),
  zip: ZIP,
  date_of_birth: DOB,
  notes: z.string().trim().max(2000).optional().nullable(),
})

export const insuranceApplicationUpdateSchema = insuranceApplicationSchema
  .partial()
  .extend({
    id: z.string().uuid(),
  })

export function formatZodError(error: z.ZodError) {
  return error.flatten().fieldErrors
}
