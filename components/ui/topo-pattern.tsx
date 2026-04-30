/** Lightweight topo lines — matches hero motif for marketing sections */
export function TopoPattern({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M0 180c42-58 118-92 198-78 80 14 142 68 168 132M12 220c48-102 160-168 280-152M40 60c22 38 68 58 120 52 52-6 96-34 118-72"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M80 240c28-22 62-34 100-30 38 4 72 22 98 48M120 20c18 22 48 36 82 34 34-2 64-20 78-44"
        stroke="currentColor"
        strokeWidth="0.45"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  )
}
