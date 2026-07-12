'use client'

import { useState } from 'react'

export function EnrollmentWelcome({
  onContinue,
  onCancel,
}: {
  onContinue: () => void
  onCancel: () => void
}) {
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A53E]">
        Enrollment
      </p>
      <h1
        className="mb-3 font-medium text-[#14432A]"
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
        }}
      >
        Welcome to coverage enrollment
      </h1>
      <p className="mb-6 max-w-2xl font-sans text-[0.9375rem] leading-[1.65] text-[#55655D]">
        You are about to begin a Centuries Mutual enrollment application. Choose a pathway
        that fits your household — Individual &amp; Family (ACA), Medicare Advantage,
        Medicare Supplement, Dental, or Group — and complete the required applicant details.
      </p>

      <div className="mb-6 rounded-2xl bg-[#14432A]/[0.06] p-5 sm:p-6">
        <p className="m-0 mb-3 font-sans text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[#55655D]">
          Legal disclosure
        </p>
        <div className="max-h-56 space-y-3 overflow-y-auto font-sans text-[0.8125rem] leading-[1.6] text-[#55655D]">
          <p className="m-0">
            By continuing, you confirm that the information you provide is true and complete
            to the best of your knowledge. False statements may result in denial of coverage,
            rescission, or other remedies permitted by law.
          </p>
          <p className="m-0">
            Centuries Mutual and its carriers may use and disclose your information as needed
            to process this application, determine eligibility, underwrite (where permitted),
            and administer benefits, consistent with applicable privacy notices and HIPAA
            where health information is involved.
          </p>
          <p className="m-0">
            Submitting an application does not guarantee coverage. Final eligibility, plan
            availability, premiums, and effective dates depend on carrier rules, election
            periods, and regulatory requirements. You may be asked for additional
            documentation before enrollment is confirmed.
          </p>
          <p className="m-0">
            Electronic signatures and consents captured in this flow have the same legal
            effect as wet-ink signatures under applicable electronic transactions laws.
          </p>
          <p className="m-0">
            You may cancel before final submission. After submission, your application status
            (including Plan ID) will appear in Settings once issued.
          </p>
        </div>
      </div>

      <label className="mb-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked)
            setError(null)
          }}
          className="mt-1 h-4 w-4 accent-[#0F3D2E]"
        />
        <span className="font-sans text-[0.8125rem] leading-[1.55] text-[#14432A]">
          I have read and agree to the enrollment disclosures, privacy practices, and
          electronic consent terms above.
        </span>
      </label>

      {error ? <p className="mb-3 font-sans text-[0.8125rem] text-[#B3402A]">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (!accepted) {
              setError('Please accept the legal disclosure to continue.')
              return
            }
            onContinue()
          }}
          className="inline-flex items-center justify-center rounded-[10px] bg-[#0F3D2E] px-5 py-2.5 font-sans text-[0.875rem] font-semibold text-[#FAFCFB] transition hover:bg-[#0A2E22]"
        >
          Continue to enrollment
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border-0 bg-transparent px-2 py-2 font-sans text-[0.8125rem] font-semibold text-[#55655D] transition hover:text-[#14432A]"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
