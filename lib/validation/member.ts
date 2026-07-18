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
  .refine((v) => v.length === 0 || v.length === 10 || v.length === 11, {
    message: 'Please enter a valid US phone number.',
  })
  .transform((v) => (v.length === 11 && v.startsWith('1') ? v.slice(1) : v))
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

export const careerApplicationSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(60),
  last_name: z.string().trim().min(1, 'Last name is required.').max(60),
  email: EMAIL,
  phone: PHONE.optional(),
  position: z.string().trim().min(1, 'Please choose a role.').max(120),
  location: z.string().trim().max(120).optional().nullable(),
  work_authorization: z.string().trim().max(120).optional().nullable(),
  linkedin_url: z
    .string()
    .trim()
    .url('Enter a valid URL.')
    .max(300)
    .optional()
    .or(z.literal('')),
  portfolio_url: z
    .string()
    .trim()
    .url('Enter a valid URL.')
    .max(300)
    .optional()
    .or(z.literal('')),
  cover_letter: z.string().trim().max(5000).optional().nullable(),
})

const OPTIONAL_DATE = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.')
  .optional()
  .or(z.literal(''))

const acaDependentSchema = z.object({
  first_name: z.string().trim().max(60).optional().or(z.literal('')),
  last_name: z.string().trim().max(60).optional().or(z.literal('')),
  dob: OPTIONAL_DATE,
  relationship: z.string().trim().max(40).optional().or(z.literal('')),
})

/**
 * Public ACA (marketplace) enrollment submission from the hero "Enrollment"
 * flow. Applicants may not have an account yet, so this is written server-side
 * with the service-role key. Rich detail is stored as JSON in `notes`.
 */
export const acaEnrollmentSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(60),
  middle_initial: z.string().trim().max(1).optional().or(z.literal('')),
  last_name: z.string().trim().min(1, 'Last name is required.').max(60),
  email: EMAIL,
  phone: PHONE.optional(),
  date_of_birth: DOB,
  ssn: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => v.length === 9, 'Enter a valid 9-digit SSN.'),
  sex: z.string().trim().min(1, 'Select a sex as it appears on legal documents.').max(20),
  address: z.string().trim().min(1, 'Address is required.').max(200),
  apt: z.string().trim().max(40).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'City is required.').max(80),
  state: z
    .string()
    .trim()
    .length(2, 'State must be a 2-letter code.')
    .transform((v) => v.toUpperCase()),
  zip: ZIP,
  county: z.string().trim().max(80).optional().or(z.literal('')),
  citizenship: z.string().trim().max(60).optional().or(z.literal('')),
  tobacco: z.enum(['Yes', 'No']).optional(),

  // Enrollment period / SEP declaration
  enrollment_period: z.enum(['open', 'sep']),
  sep_qualifying_event: z.string().trim().max(120).optional().or(z.literal('')),
  sep_event_date: OPTIONAL_DATE,

  // Household & income
  household_size: z.coerce.number().int().min(1).max(20),
  annual_income: z.coerce.number().min(0).max(100000000),
  filing_status: z.string().trim().max(60).optional().or(z.literal('')),
  current_coverage: z.string().trim().max(80).optional().or(z.literal('')),
  coverage_start: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a coverage start date.'),
  dependents: z.array(acaDependentSchema).max(15).optional(),

  // Attestations
  sep_attested: z.boolean().optional(),
  disclosures_accepted: z.boolean().refine((v) => v === true, {
    message: 'You must accept the disclosures to continue.',
  }),
  signature: z.string().trim().min(2, 'Type your full legal name to e-sign.').max(120),
})

export type AcaEnrollmentInput = z.infer<typeof acaEnrollmentSchema>

/**
 * Public ingest from medicare.reviews → Centuries Mutual admin Files vault.
 * Written with the service-role key; tagged source=medicare.reviews.
 */
export const medicareReviewsIngestSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.').max(60),
  last_name: z.string().trim().min(1, 'Last name is required.').max(60),
  email: EMAIL,
  phone: PHONE.optional(),
  date_of_birth: DOB.optional(),
  address: z.string().trim().max(200).optional().or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  state: z
    .string()
    .trim()
    .transform((v) => v.toUpperCase())
    .refine((v) => v.length === 0 || v.length === 2, {
      message: 'State must be a 2-letter code.',
    })
    .optional()
    .or(z.literal('')),
  zip: z
    .string()
    .trim()
    .refine((v) => v.length === 0 || /^\d{5}(-\d{4})?$/.test(v), {
      message: 'Enter a valid US ZIP code.',
    })
    .optional()
    .or(z.literal('')),
  plan_type: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal('')),
  medicare_number: z.string().trim().max(40).optional().or(z.literal('')),
  preferred_language: z.string().trim().max(40).optional().or(z.literal('')),
  county: z.string().trim().max(80).optional().or(z.literal('')),
  coverage_start: OPTIONAL_DATE,
  lead_id: z.string().trim().max(120).optional().or(z.literal('')),
  marketing_id: z.string().trim().max(120).optional().or(z.literal('')),
  producer_id: z.string().trim().max(120).optional().or(z.literal('')),
  /** Free-form extras from medicare.reviews — stored inside notes JSON. */
  meta: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().trim().max(5000).optional().nullable(),
})

export type MedicareReviewsIngestInput = z.infer<typeof medicareReviewsIngestSchema>

export function formatZodError(error: z.ZodError) {
  return error.flatten().fieldErrors
}
