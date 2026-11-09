import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import ExternalLink from '../ui/ExternalLink'
import { buttonClass } from '../ui/Button'
import { forum, legalLinks, socialLinks } from '../../data/site'
import { ccCredits, unsplashCredits } from '../../data/photoCredits'

// The footer is navy in both themes, so its text is always light.
const copy = 'text-[.85rem] text-dll-foot-text mt-[14px] mb-0'

export default function Footer() {
  return (
    <footer className="bg-dll-navy text-dll-on-dark pt-[52px] pb-7 [&_a]:text-dll-on-dark">
      <div className="max-w-wrap mx-auto px-4">
        <div className="flex flex-wrap justify-between items-start gap-7 pb-7 mb-[22px] border-b border-dll-on-dark/20">
          <div>
            <Link to="/" className="inline-flex items-center gap-[10px] min-h-[44px] font-heading font-extrabold text-[1.22rem] no-underline whitespace-nowrap">
              {/* Decorative: the link is named by its text */}
              <img src="/images/brand/dll-logo.svg" alt="" width={44} height={44} className="block w-11 h-11" />
              Daily Living Labs
            </Link>
            <p className="text-dll-foot-text max-w-[36ch] mt-[10px] mb-0">Discover · Build · Share</p>
            <ul aria-label="Social media" className="flex gap-[10px] list-none p-0 mt-[14px] mb-0">
              {socialLinks.map((s) => (
                <li key={s.href}>
                  <ExternalLink
                    href={s.href}
                    noArrow
                    className="grid place-items-center w-11 h-11 rounded-full hover:bg-dll-on-dark/25 no-underline"
                  >
                    {/* Official logo as provided, kept at its own proportions. Decorative: the link is named below. */}
                    <img src={s.logo} alt="" width={s.w} height={s.h} className="block h-8 w-auto" />
                    <span className="sr-only">{s.label}</span>
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-extrabold text-[1.15rem] mt-0 mb-3">Ready to help?</p>
            {/* Yellow button keeps its dark text, so override the footer's white link color */}
            <a href={forum.register} className={buttonClass('yellow', 'md', '!text-dll-on-accent')}>
              Join the Community
            </a>
          </div>
        </div>

        <details className="mb-5 text-dll-foot-text text-[.85rem]">
          <summary className="flex items-center min-h-[44px] cursor-pointer font-bold text-dll-on-dark">
            Photo credits
          </summary>
          <ul className="list-none p-0 mt-[6px] mb-0 grid gap-[6px]">
            {ccCredits.map((c) => (
              <li key={c.section}>
                <b className="text-dll-on-dark">{c.section}:</b>{' '}
                <ExternalLink href={c.people[0].href}>{c.people[0].name}</ExternalLink> for{' '}
                <ExternalLink href={c.people[1].href}>{c.people[1].name}</ExternalLink>,{' '}
                <ExternalLink href={c.people[2].href}>{c.people[2].name}</ExternalLink>, cropped and color adjusted.
              </li>
            ))}
            {unsplashCredits.map((c) => (
              <li key={c.section}>
                <b className="text-dll-on-dark">{c.section}:</b>{' '}
                {c.people.map((p, i) => (
                  <Fragment key={p.href}>
                    <ExternalLink href={p.href}>{p.name}</ExternalLink> on Unsplash
                    {i < c.people.length - 1 ? '; ' : '.'}
                  </Fragment>
                ))}
              </li>
            ))}
            <li>
              <b className="text-dll-on-dark">Other photos:</b> Daily Living Labs project photos.
            </li>
          </ul>
          <p className={`${copy} !mt-[6px]`}>Unsplash photos are cropped and color adjusted.</p>
        </details>

        <ul className="flex flex-wrap gap-[18px] text-[.92rem] list-none p-0 m-0">
          {legalLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="inline-flex items-center min-h-[44px]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className={copy}>
          <span aria-hidden="true">↗</span> Links with this arrow open another site in a new tab.
        </p>
        <p className={copy}>Daily Living Labs is a nonprofit based in Texas.</p>
        <p className={copy}>Built with the community through participatory design and guided by disability justice principles.</p>
        <p className={`${copy} !mt-1`}>© 2026 Daily Living Labs</p>
      </div>
    </footer>
  )
}
