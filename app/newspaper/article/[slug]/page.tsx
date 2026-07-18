import Link from 'next/link'
import Masthead from '../../../../components/newspaper/Masthead'
import {
  articles,
  getArticle,
  type NewspaperArticle,
} from '../../../../components/newspaper/data'

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) return { title: 'Article Not Found — The Centuries Mutual Times' }
  return {
    title: `${article.title} — The Centuries Mutual Times`,
    description: article.deck,
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)

  if (!article) {
    return (
      <>
        <Masthead />
        <main className="nyt-container nyt-article" style={{ textAlign: 'center' }}>
          <p className="nyt-kicker nyt-kicker--gold">404</p>
          <h1 className="nyt-headline" style={{ fontSize: '2.4rem' }}>
            Article Not Found
          </h1>
          <p className="nyt-deck">The story you&rsquo;re looking for doesn&rsquo;t exist.</p>
          <p style={{ marginTop: '18px' }}>
            <Link className="nyt-back" href="/">
              &larr; Back to The Times
            </Link>
          </p>
        </main>
      </>
    )
  }

  const related: NewspaperArticle[] = articles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4)

  return (
    <>
      <Masthead />

      <main className="nyt-container nyt-article">
        <div style={{ marginBottom: '16px' }}>
          <Link className="nyt-back" href="/">
            &larr; Back to The Times
          </Link>
        </div>

        <article>
          {/* Head */}
          <div className="nyt-article-head">
            <p className="nyt-kicker nyt-kicker--gold">{article.kicker}</p>
            <h1 className="nyt-headline">{article.title}</h1>
            <p className="nyt-deck">{article.deck}</p>
            <div className="nyt-article-meta">
              <span className="nyt-avatar" aria-hidden="true">
                {article.author.charAt(0)}
              </span>
              <span className="nyt-byline">
                By <strong>{article.author}</strong>
                <br />
                <time dateTime="2026-07-17">{article.date}</time>
              </span>
            </div>
          </div>

          {/* Lead image */}
          <figure className="nyt-article-figure">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="nyt-img" src={article.image} alt={article.imageCaption} />
            <figcaption className="nyt-figcaption">
              {article.imageCaption}{' '}
              <span className="nyt-credit">{article.imageCredit}</span>
            </figcaption>
          </figure>

          {/* Body */}
          <div className="nyt-article-body">
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>

        {/* Section rule + related */}
        <hr className="nyt-article-rule" />
        <div className="nyt-container--narrow" style={{ margin: '0 auto' }}>
          <div className="nyt-section-rule" style={{ marginTop: 0 }}>
            <h2>More From The Times</h2>
          </div>
          <ul className="nyt-rail-list">
            {related.map((rel) => (
              <li key={rel.slug}>
                <p className="nyt-kicker">{rel.kicker}</p>
                <h3 className="nyt-hed">
                  <Link href={`/article/${rel.slug}`}>{rel.title}</Link>
                </h3>
                <span className="nyt-rail-time">{rel.section}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="nyt-colophon">
        <div className="nyt-container">
          <div className="nyt-colophon-mark">The Centuries Mutual Times</div>
          <div>&copy; {new Date().getFullYear()} Centuries Mutual. All rights reserved.</div>
        </div>
      </footer>
    </>
  )
}
