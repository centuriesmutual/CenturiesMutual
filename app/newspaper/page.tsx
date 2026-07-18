import Link from 'next/link'
import Masthead from '../../components/newspaper/Masthead'
import BoxNewsColumns from '../../components/newspaper/BoxNewsColumns'
import {
  articles,
  opinionItems,
  businessBriefs,
  type NewspaperArticle,
} from '../../components/newspaper/data'

export const metadata = {
  title: 'The Centuries Mutual Times — Front Page',
}

const lead = articles[0]
const leftColumn = [articles[1], articles[2], articles[3]].filter(Boolean) as NewspaperArticle[]
const river = [articles[4], articles[5], articles[6], articles[7]].filter(
  Boolean,
) as NewspaperArticle[]
const latest = [
  articles[8],
  articles[9],
  articles[10],
  articles[11],
  articles[12],
].filter(Boolean) as NewspaperArticle[]

function StoryThumb({ article }: { article: NewspaperArticle }) {
  return (
    <article className="nyt-story">
      <p className="nyt-kicker">{article.kicker}</p>
      <h3 className="nyt-hed">
        <Link href={`/article/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="nyt-summary">{article.deck}</p>
      <p className="nyt-byline" style={{ marginTop: '8px' }}>
        By <strong>{article.author}</strong>
      </p>
    </article>
  )
}

export default function NewspaperFrontPage() {
  return (
    <>
      <Masthead />

      <main className="nyt-container nyt-frontpage">
        <div className="nyt-grid">
          <section className="nyt-col nyt-col--left nyt-stack" aria-label="Top stories">
            {leftColumn.map((article) => (
              <StoryThumb key={article.slug} article={article} />
            ))}
          </section>

          <section className="nyt-col nyt-lead" aria-label="Lead story">
            <figure>
              <Link href={`/article/${lead.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="nyt-img" src={lead.image} alt={lead.imageCaption} />
              </Link>
              <figcaption className="nyt-figcaption">
                {lead.imageCaption}{' '}
                <span className="nyt-credit">{lead.imageCredit}</span>
              </figcaption>
            </figure>
            <p className="nyt-kicker nyt-kicker--gold">{lead.kicker}</p>
            <h2 className="nyt-headline">
              <Link href={`/article/${lead.slug}`}>{lead.title}</Link>
            </h2>
            <p className="nyt-deck">{lead.deck}</p>
            <p className="nyt-byline">
              By <strong>{lead.author}</strong>
            </p>
            <div className="nyt-dropcap" style={{ marginTop: '14px' }}>
              <p className="nyt-summary" style={{ fontSize: '1.02rem', color: 'var(--nyt-ink)' }}>
                {lead.body[0]}
              </p>
            </div>
          </section>

          <aside className="nyt-col nyt-col--right" aria-label="Latest and opinion">
            <div className="nyt-section-rule" style={{ marginTop: 0 }}>
              <h2>Latest</h2>
            </div>
            <ul className="nyt-rail-list">
              {latest.map((article) => (
                <li key={article.slug}>
                  <h3 className="nyt-hed">
                    <Link href={`/article/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <span className="nyt-rail-time">{article.section}</span>
                </li>
              ))}
            </ul>

            <div className="nyt-section-rule">
              <h2>Opinion</h2>
            </div>
            <div>
              {opinionItems.slice(0, 2).map((item) => (
                <div className="nyt-opinion-item" key={item.title}>
                  <h3 className="nyt-hed" style={{ fontSize: '1.02rem' }}>
                    {item.title}
                  </h3>
                  <p className="nyt-byline" style={{ marginBottom: '6px' }}>
                    {item.author}
                  </p>
                  <p className="nyt-summary">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="nyt-section-rule" id="business">
          <h2>Business &amp; Real Estate</h2>
          <span className="nyt-section-more">More Coverage</span>
        </div>
        <div className="nyt-river">
          {river.map((article) => (
            <article className="nyt-river-item" key={article.slug}>
              <figure className="nyt-thumb">
                <Link href={`/article/${article.slug}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="nyt-img" src={article.image} alt={article.imageCaption} />
                </Link>
              </figure>
              <p className="nyt-kicker">{article.kicker}</p>
              <h3 className="nyt-hed">
                <Link href={`/article/${article.slug}`}>{article.title}</Link>
              </h3>
              <p className="nyt-summary">{article.deck}</p>
              <p className="nyt-byline" style={{ marginTop: '8px' }}>
                By <strong>{article.author}</strong>
              </p>
            </article>
          ))}
        </div>

        <BoxNewsColumns />

        <div className="nyt-section-rule" id="briefs">
          <h2>Business Briefs</h2>
        </div>
        <div className="nyt-briefs">
          {businessBriefs.map((brief) => (
            <div className="nyt-brief" key={brief.title}>
              <h3 className="nyt-hed">{brief.title}</h3>
              <p className="nyt-summary">{brief.excerpt}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="nyt-colophon">
        <div className="nyt-container">
          <div className="nyt-colophon-mark">The Centuries Mutual Times</div>
          <div>
            &copy; {new Date().getFullYear()} Centuries Mutual. Printed for members and neighbors.
          </div>
        </div>
      </footer>
    </>
  )
}
