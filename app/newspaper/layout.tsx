import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Centuries Mutual Times',
  description:
    'The Centuries Mutual Times — financial news, real estate and community coverage.',
}

/**
 * Paper palette: warm tan ground complementary to brand green (#0F3D2E),
 * ink pulled toward forest rather than pure black, gold for editorial accents.
 */
const NEWSPAPER_CSS = `
.nyt-paper {
  --nyt-serif: var(--font-playfair), Georgia, 'Times New Roman', serif;
  --nyt-body: Georgia, 'Times New Roman', Times, serif;
  --nyt-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --nyt-ink: #1A2A22;
  --nyt-ink-soft: #3D4A42;
  --nyt-muted: #6B746C;
  --nyt-rule: #D4C8B4;
  --nyt-rule-strong: #0F3D2E;
  --nyt-panel: #E8DFD0;
  --nyt-gold: #C9A53E;
  --nyt-green: #0F3D2E;
  --nyt-paper: #F2E8D5;
  background: var(--nyt-paper);
  color: var(--nyt-ink);
  font-family: var(--nyt-body);
  min-height: 100dvh;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.nyt-paper *,
.nyt-paper *::before,
.nyt-paper *::after { box-sizing: border-box; }
.nyt-paper a { color: inherit; text-decoration: none; }
.nyt-paper a:hover .nyt-headline,
.nyt-paper a:hover .nyt-hed {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.nyt-container {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;
}
.nyt-container--narrow { max-width: 720px; }

/* ---------- Masthead ---------- */
.nyt-utility {
  background: var(--nyt-green);
  color: #F2E8D5;
  font-family: var(--nyt-sans);
  font-size: 11px;
  letter-spacing: .04em;
}
.nyt-utility a { color: #F2E8D5; }
.nyt-utility a:hover { color: var(--nyt-gold); text-decoration: none; }
.nyt-utility-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 9px 0;
}
.nyt-utility-left, .nyt-utility-right { display: flex; align-items: center; gap: 16px; }
.nyt-utility a, .nyt-utility span.nyt-util-item { white-space: nowrap; }
.nyt-util-strong { font-weight: 700; color: var(--nyt-gold); }

.nyt-masthead {
  text-align: center;
  padding: 28px 0 14px;
  border-bottom: 3px double var(--nyt-rule-strong);
}
.nyt-wordmark {
  font-family: var(--nyt-serif);
  font-weight: 900;
  color: var(--nyt-green);
  line-height: .92;
  letter-spacing: -0.6px;
  margin: 0;
  font-size: clamp(2.4rem, 7.5vw, 4.75rem);
}
.nyt-wordmark .nyt-wordmark-the {
  display: block;
  font-size: .26em;
  font-weight: 500;
  letter-spacing: .28em;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: var(--nyt-ink-soft);
}
.nyt-gold-rule {
  height: 2px;
  background: var(--nyt-gold);
  width: 88px;
  margin: 12px auto 0;
}

.nyt-dateline {
  border-bottom: 1px solid var(--nyt-rule);
  font-family: var(--nyt-sans);
  font-size: 11px;
  color: var(--nyt-ink-soft);
}
.nyt-dateline-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  flex-wrap: wrap;
}
.nyt-dateline-left, .nyt-dateline-right { display: flex; align-items: center; flex-wrap: wrap; }
.nyt-dateline-item { padding: 0 12px; white-space: nowrap; }
.nyt-dateline-item + .nyt-dateline-item { border-left: 1px solid var(--nyt-rule); }
.nyt-dateline-left .nyt-dateline-item:first-child { padding-left: 0; }
.nyt-dateline-right .nyt-dateline-item:last-child { padding-right: 0; }

.nyt-nav {
  border-bottom: 1px solid var(--nyt-rule);
  margin-bottom: 0;
}
.nyt-nav-inner {
  display: flex;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0;
}
.nyt-nav-link {
  font-family: var(--nyt-serif);
  font-size: 13px;
  letter-spacing: .02em;
  color: var(--nyt-ink);
  padding: 10px 14px;
  white-space: nowrap;
}
.nyt-nav-link + .nyt-nav-link { border-left: 1px solid var(--nyt-rule); }
.nyt-nav-link:hover { color: var(--nyt-green); }

/* ---------- Type ---------- */
.nyt-kicker {
  font-family: var(--nyt-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--nyt-green);
  margin: 0 0 6px;
}
.nyt-kicker--gold { color: var(--nyt-gold); }
.nyt-headline {
  font-family: var(--nyt-serif);
  font-weight: 800;
  color: var(--nyt-ink);
  line-height: 1.08;
  margin: 0 0 10px;
}
.nyt-hed {
  font-family: var(--nyt-serif);
  font-weight: 700;
  color: var(--nyt-ink);
  line-height: 1.18;
  margin: 0 0 6px;
}
.nyt-deck {
  font-family: var(--nyt-body);
  color: var(--nyt-ink-soft);
  line-height: 1.45;
  margin: 0 0 10px;
  font-size: 1.05rem;
}
.nyt-byline {
  font-family: var(--nyt-sans);
  font-size: 11px;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--nyt-muted);
  margin: 0;
}
.nyt-byline strong { color: var(--nyt-ink); font-weight: 700; }
.nyt-summary {
  font-family: var(--nyt-body);
  font-size: .95rem;
  line-height: 1.55;
  color: var(--nyt-ink-soft);
  margin: 0;
}
.nyt-img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--nyt-rule);
}
.nyt-figcaption {
  font-family: var(--nyt-sans);
  font-size: 11px;
  line-height: 1.4;
  color: var(--nyt-muted);
  margin-top: 8px;
}
.nyt-figcaption .nyt-credit { color: #8A857A; }

/* ---------- Front page ---------- */
.nyt-frontpage { padding: 24px 0 48px; }
.nyt-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--nyt-rule);
}
@media (min-width: 900px) {
  .nyt-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 2fr) minmax(0, 1fr);
    gap: 0;
  }
  .nyt-col { padding: 0 22px; }
  .nyt-col--left { padding-left: 0; }
  .nyt-col--right { padding-right: 0; }
  .nyt-col + .nyt-col { border-left: 1px solid var(--nyt-rule); }
}
.nyt-col { display: flex; flex-direction: column; }

.nyt-lead .nyt-headline { font-size: clamp(1.85rem, 3.8vw, 2.65rem); }
.nyt-lead .nyt-deck { font-size: 1.12rem; }
.nyt-lead figure { margin: 0 0 16px; }

.nyt-stack > * + * {
  border-top: 1px solid var(--nyt-rule);
  margin-top: 18px;
  padding-top: 18px;
}
.nyt-story .nyt-hed { font-size: 1.12rem; }

.nyt-dropcap > p:first-of-type::first-letter {
  float: left;
  font-family: var(--nyt-serif);
  font-weight: 800;
  font-size: 3.1em;
  line-height: .82;
  padding: 4px 8px 0 0;
  color: var(--nyt-green);
}

.nyt-section-rule {
  display: flex;
  align-items: baseline;
  gap: 12px;
  border-top: 2px solid var(--nyt-rule-strong);
  margin: 36px 0 18px;
  padding-top: 10px;
}
.nyt-section-rule h2 {
  font-family: var(--nyt-serif);
  font-weight: 700;
  font-size: 1.2rem;
  margin: 0;
  color: var(--nyt-green);
}
.nyt-section-rule .nyt-section-more {
  margin-left: auto;
  font-family: var(--nyt-sans);
  font-size: 11px;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--nyt-gold);
}

.nyt-river {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 700px) {
  .nyt-river { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1000px) {
  .nyt-river {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .nyt-river .nyt-river-item {
    padding: 0 18px;
    border-left: 1px solid var(--nyt-rule);
  }
  .nyt-river .nyt-river-item:first-child { padding-left: 0; border-left: 0; }
  .nyt-river .nyt-river-item:last-child { padding-right: 0; }
}
.nyt-river .nyt-river-item { display: flex; flex-direction: column; }
.nyt-river .nyt-hed { font-size: 1.08rem; }
.nyt-thumb { margin: 0 0 10px; }

.nyt-rail-list { list-style: none; margin: 0; padding: 0; }
.nyt-rail-list li {
  padding: 12px 0;
  border-top: 1px solid var(--nyt-rule);
}
.nyt-rail-list li:first-child { border-top: 0; padding-top: 0; }
.nyt-rail-list .nyt-hed { font-size: .98rem; }
.nyt-rail-time {
  font-family: var(--nyt-sans);
  font-size: 11px;
  color: var(--nyt-muted);
}

.nyt-opinion-item {
  padding-left: 12px;
  border-left: 3px solid var(--nyt-green);
}
.nyt-opinion-item + .nyt-opinion-item { margin-top: 16px; }

.nyt-briefs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 700px) {
  .nyt-briefs { grid-template-columns: repeat(3, 1fr); gap: 18px; }
}
.nyt-brief {
  background: var(--nyt-panel);
  border: 1px solid var(--nyt-rule);
  padding: 16px 18px;
}
.nyt-brief .nyt-hed { font-size: 1.02rem; margin-bottom: 8px; }

/* ---------- Article ---------- */
.nyt-article { padding: 28px 0 56px; }
.nyt-article-head { max-width: 720px; margin: 0 auto; }
.nyt-article-head .nyt-headline { font-size: clamp(2rem, 5vw, 2.9rem); }
.nyt-article-head .nyt-deck { font-size: 1.18rem; }
.nyt-article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--nyt-rule);
  border-bottom: 1px solid var(--nyt-rule);
  padding: 12px 0;
  margin: 16px 0 0;
}
.nyt-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--nyt-green); color: #F2E8D5;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--nyt-serif); font-weight: 700; flex: 0 0 auto;
}
.nyt-article-figure { margin: 22px 0; }
.nyt-article-figure figcaption { max-width: 720px; margin: 8px auto 0; }
.nyt-article-body {
  max-width: 680px;
  margin: 0 auto;
  font-family: var(--nyt-body);
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--nyt-ink);
}
.nyt-article-body p { margin: 0 0 1.15em; }
.nyt-article-body > p:first-of-type::first-letter {
  float: left;
  font-family: var(--nyt-serif);
  font-weight: 800;
  font-size: 3.3em;
  line-height: .8;
  padding: 6px 10px 0 0;
  color: var(--nyt-green);
}
.nyt-article-rule {
  max-width: 680px;
  margin: 8px auto 26px;
  border: 0;
  border-top: 2px solid var(--nyt-rule-strong);
}

.nyt-colophon {
  border-top: 3px double var(--nyt-rule-strong);
  margin-top: 48px;
  padding: 28px 0 40px;
  text-align: center;
  font-family: var(--nyt-sans);
  font-size: 12px;
  color: var(--nyt-muted);
  background: linear-gradient(180deg, transparent 0%, rgba(15,61,46,0.04) 100%);
}
.nyt-colophon .nyt-colophon-mark {
  font-family: var(--nyt-serif);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--nyt-green);
  margin-bottom: 6px;
}

.nyt-back {
  font-family: var(--nyt-sans);
  font-size: 12px;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--nyt-green);
  font-weight: 600;
}
.nyt-back:hover { color: var(--nyt-gold); text-decoration: underline; }
`

export default function NewspaperLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${playfair.variable} nyt-paper`}>
      <style dangerouslySetInnerHTML={{ __html: NEWSPAPER_CSS }} />
      {children}
    </div>
  )
}
