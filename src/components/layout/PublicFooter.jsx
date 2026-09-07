import React from 'react';
import { Link } from 'react-router-dom';
import { brand, footerColumns } from '../../data/seed.js';

const SOCIALS = [
  { name: 'Twitter', href: 'https://twitter.com/', bg: '#0A0A0A', path: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/', bg: '#0A66C2', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { name: 'YouTube', href: 'https://www.youtube.com/', bg: '#FF0000', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.2.432L15.818 12l-6.273 3.568z' },
];

export default function PublicFooter() {
  return (
    <footer className="bg-paper text-sm text-brand" data-component-id="footer">
      <div className="border-t border-off-white-100 py-14">
        <div className="c-container">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-4">
              <Link to="/" className="inline-flex items-center gap-3" aria-label={`${brand.name} home`}>
                <img src="/crest.svg" alt="" width="56" height="56" className="h-14 w-auto" />
                <span>
                  <span className="block font-heading text-lg text-heading">{brand.name}</span>
                  <span className="block text-[11px] uppercase tracking-widest text-cyan-deep">E-learning platform</span>
                </span>
              </Link>
              <p className="mt-4 max-w-[40ch] text-xs leading-relaxed text-body/80">
                {brand.tagline}
              </p>
            </div>
            {footerColumns.map((col) => (
              <nav key={col.heading} aria-label={col.heading} className="col-span-12 md:col-span-6 lg:col-span-2">
                <h3 className="h4 mb-4 text-heading">{col.heading}</h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(([to, label]) => (
                    <li key={label}>
                      <Link to={to} className="font-medium animated-underline animated-underline--off hover:animated-underline--on">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-off-white-100 py-8">
        <div className="c-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="h4 mb-2 text-heading">Follow us</h3>
            <p className="text-xs text-body/80">Stay updated with new courses, instructor tips and learner stories.</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="grid size-11 place-items-center rounded-full text-white shadow-sm ring-1 ring-black/10 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  style={{ background: s.bg }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-brand py-5">
        <div className="c-container flex flex-col items-start justify-between gap-3 text-xs text-white/80 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              ['/about', 'About'],
              ['/about', 'Contact'],
              ['/portal/login', 'Sign in'],
            ].map(([to, label]) => (
              <li key={label}>
                <Link to={to} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}