import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Kit.jsx';
import { brand, footerColumns } from '../../data/seed.js';
import cn from '../../lib/cn.js';

const SOCIALS = ['youtube', 'x', 'facebook', 'tiktok', 'linkedin', 'instagram', 'rss'];

export default function PublicFooter() {
  return (
    <footer className="bg-paper text-sm text-brand" data-component-id="footer">
      <div className="border-t border-off-white-100 py-14">
        <div className="c-container">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-3">
              <Link to="/" className="inline-block" aria-label="Brightwell University home">
                <img src="/crest.svg" alt="" width="88" height="88" className="h-24 w-auto md:h-28" />
              </Link>
              <p className="mt-4 max-w-[28ch] text-xs leading-relaxed text-body/80">
                {brand.tagline}
              </p>
            </div>
            {footerColumns.map((col) => (
              <nav key={col.heading} aria-label={col.heading} className="col-span-12 md:col-span-6 lg:col-span-3">
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
            <h3 className="h4 mb-2 text-heading">Connect with us</h3>
            <p className="text-xs text-body/80">Follow Brightwell University on your favourite platforms.</p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {SOCIALS.map((s) => (
              <li key={s}>
                <a
                  href="#connect"
                  aria-label={s}
                  className="c-button c-button--primary flex size-12 items-center justify-center rounded-full p-0!"
                >
                  <Icon name={s} className="c-icon--md" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-brand py-5">
        <div className="c-container flex flex-col items-start justify-between gap-3 text-xs text-white/80 md:flex-row md:items-center">
          <p>© 2026 {brand.name}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {['Accessibility', 'Privacy', 'Legal', 'Cookies', 'Sitemap'].map((l) => (
              <li key={l}>
                <a href="/about" className="hover:text-white">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}