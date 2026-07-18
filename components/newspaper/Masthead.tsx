import Link from 'next/link'
import { SECTIONS } from './data'

function todayLong(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Masthead() {
  const date = todayLong()

  return (
    <header>
      <div className="nyt-utility">
        <div className="nyt-container nyt-utility-inner">
          <div className="nyt-utility-left">
            <span className="nyt-util-strong">{date}</span>
            <span className="nyt-util-item">Vol. XII · No. 214</span>
          </div>
          <div className="nyt-utility-right">
            <Link href="/">Home</Link>
            <a href="https://centuriesmutual.com/login">Log In</a>
          </div>
        </div>
      </div>

      <div className="nyt-container nyt-masthead">
        <Link href="/" aria-label="The Centuries Mutual Times — front page">
          <h1 className="nyt-wordmark">
            <span className="nyt-wordmark-the">The</span>
            Centuries Mutual Times
          </h1>
        </Link>
        <div className="nyt-gold-rule" aria-hidden="true" />
      </div>

      <div className="nyt-dateline">
        <div className="nyt-container nyt-dateline-inner">
          <div className="nyt-dateline-left">
            <span className="nyt-dateline-item">{date}</span>
            <span className="nyt-dateline-item">Financial &amp; Real Estate Edition</span>
          </div>
          <div className="nyt-dateline-right">
            <span className="nyt-dateline-item">Dallas</span>
            <span className="nyt-dateline-item">Markets ▲ 0.8%</span>
          </div>
        </div>
      </div>

      <nav className="nyt-nav" aria-label="Sections">
        <div className="nyt-container nyt-nav-inner">
          {SECTIONS.map((section) => (
            <a key={section} href={`#${section.toLowerCase().replace(/\s+/g, '-')}`} className="nyt-nav-link">
              {section}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
