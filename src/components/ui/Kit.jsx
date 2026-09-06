import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Award, Banknote, Building2, Calendar, CalendarClock, CheckCircle2,
  ChevronLeft, ChevronRight, Clock, Facebook, GraduationCap, IdCard, Instagram,
  Linkedin, Mail, MapPin, Megaphone, Menu, Pause, Phone, Play, Quote, Rss,
  Search, Twitter, Users, X, Youtube,
} from 'lucide-react';
import cn from '../../lib/cn.js';

/* --------------------------------------------------------------------------
   Icon — thin wrapper matching the ox.ac.uk sprite names we reuse.
   -------------------------------------------------------------------------- */
const ICONS = {
  search: Search,
  menu: Menu,
  cross: X,
  arrow: ArrowRight,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  play: Play,
  pause: Pause,
  bank: Banknote,
  users: Users,
  badge: IdCard,
  building: Building2,
  'calendar-clock': CalendarClock,
  award: Award,
  naira: Banknote,
  megaphone: Megaphone,
  'check-circle': CheckCircle2,
  'graduation-cap': GraduationCap,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  calendar: Calendar,
  clock: Clock,
  'quote-mark': Quote,
  youtube: Youtube,
  x: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  rss: Rss,
};

export function Icon({ name, className, ...rest }) {
  const C = ICONS[name] ?? ArrowRight;
  return <C aria-hidden focusable={false} className={cn('c-icon', className)} {...rest} />;
}

/* --------------------------------------------------------------------------
   Button — c-button (primary / secondary), the Oxford look.
   -------------------------------------------------------------------------- */
export function Button({ variant = 'primary', to, href, onClick, icon = 'chevron-right', className, children, ...rest }) {
  const cls = cn('c-button', variant === 'secondary' ? 'c-button--secondary' : 'c-button--primary', className);
  const body = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} className="c-icon--sm shrink-0" />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {body}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} {...rest}>
      {body}
    </button>
  );
}

/* --------------------------------------------------------------------------
   Section chrome — ox.ac.uk alternates white page / light band #E0EDF9.
   -------------------------------------------------------------------------- */
export function Section({ band = false, className, children, ...rest }) {
  if (band) {
    return (
      <div className="bg-band" {...rest}>
        <section className={cn('c-separator', className)}>{children}</section>
      </div>
    );
  }
  return (
    <section className={cn('c-separator', className)} {...rest}>
      {children}
    </section>
  );
}

export function SectionHeader({ title, cta, className }) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4 pb-6', className)}>
      <h2 className="h2 text-heading">{title}</h2>
      {cta && (
        <Button variant="secondary" to={cta.to}>
          {cta.label}
        </Button>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
   Divider used in card lists on the light band (accent rule on mobile).
   -------------------------------------------------------------------------- */
export function CardDivider() {
  return <hr className="my-2 border-t-2 border-accent lg:hidden" />;
}

/* --------------------------------------------------------------------------
   LazyImg — swaps the real src when the element nears the viewport.
   -------------------------------------------------------------------------- */
export function LazyImg({ src, alt = '', className, ratio = 'aspect-[3/2]', eager = false }) {
  const [ready, setReady] = useState(eager);
  const ref = useRef(null);

  useEffect(() => {
    if (eager) return undefined;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setReady(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setReady(true);
          obs.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [eager]);

  return (
    <div ref={ref} className={cn(ratio, 'overflow-hidden bg-band/70', className)}>
      {ready && src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------------------
   MetaPill — "date | reading time" yellow pill (ox.ac.uk teaser).
   -------------------------------------------------------------------------- */
export function MetaPill({ date, readTime }) {
  return (
    <dl className="meta-pill mb-0">
      <dt className="sr-only">Last updated</dt>
      <dd className="m-0">{date}</dd>
      {readTime && (
        <>
          <span aria-hidden className="text-pill-ink/60">|</span>
          <dt className="sr-only">Reading time</dt>
          <dd className="m-0">{readTime}</dd>
        </>
      )}
    </dl>
  );
}

/* --------------------------------------------------------------------------
   TeaserCard — the standard news/card teaser (ox.ac.uk `teaser`).
   `stretchTo` makes the whole card clickable via a stretched link.
   -------------------------------------------------------------------------- */
export function TeaserCard({ item, imgSrc, layout = 'vertical', metaOverlay = true, className }) {
  const horizontal = layout === 'horizontal';
  return (
    <article data-component-id="teaser" className={cn('group/teaser relative', className)}>
      <div className={cn(horizontal ? 'flex flex-col gap-4 sm:flex-row sm:items-start' : '', 'h-full')}>
        <div className={cn('relative shrink-0', horizontal ? 'sm:w-2/5' : '')}>
          <div className={cn(horizontal ? 'mb-0' : 'mb-3', 'relative')}>
            <LazyImg src={imgSrc} className="tile-radius" />
            {metaOverlay && (
              <div className="absolute left-2.5 top-2.5">
                <MetaPill date={item.date} readTime={item.readTime} />
              </div>
            )}
          </div>
        </div>
        <div className={cn('flex min-w-0 flex-col gap-3', horizontal ? 'flex-1' : '')}>
          <h3 className="h5 text-heading">
            <Link to={item.href} className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">
              {item.title}
            </Link>
          </h3>
          <div className="text-sm leading-relaxed">{item.excerpt}</div>
          {item.tags && (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <li key={t} className="tag-pill">
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
   OverlayCard — image card with bottom-gradient title (hero promo + carousel).
   -------------------------------------------------------------------------- */
export function OverlayCard({ item, imgSrc, className, aspect = 'aspect-[16/9] lg:aspect-[4/5]' }) {
  return (
    <article data-component-id="teaser-overlay" className={cn('group relative overflow-hidden rounded-md', className)}>
      <Link to={item.href} aria-label={item.title} className="group relative block no-underline">
        <div className={cn('transition-transform duration-300 group-hover:scale-105', 'overflow-hidden')}>
          <LazyImg src={imgSrc} ratio={aspect} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-30% to-black/70" />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 py-5 text-white">
          <h3 className="h5 mb-0y my-0">
            <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{item.title}</span>
          </h3>
          {item.blurb && <p className="mt-1.5 hidden text-sm text-white/75 sm:block">{item.blurb}</p>}
        </div>
      </Link>
    </article>
  );
}

/* --------------------------------------------------------------------------
   CTA — dark navy two-column band (image + serif title + button), as on ox.uk.
   -------------------------------------------------------------------------- */
export function CTA({ image, title, children, cta, flip = false, eyebrow }) {
  return (
    <section data-component-theme="dark" className="c-separator">
      <div className="c-container">
        <div className="dark grid grid-cols-1 overflow-hidden rounded-xl bg-brand text-white lg:grid-cols-12">
          <div className={cn('col-span-full lg:col-span-6', flip && 'lg:order-last')}>
            <LazyImg src={image} ratio="aspect-[16/9] lg:aspect-auto lg:h-full" />
          </div>
          <div className="col-span-full flex flex-col items-start p-7 md:p-12 lg:col-span-6">
            {eyebrow && <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cyan">{eyebrow}</p>}
            <h2 className="h2 text-heading">{title}</h2>
            <div className="c-wysiwyg mt-4 leading-relaxed text-navy-body">{children}</div>
            {cta && (
              <div className="mt-6">
                <Button to={cta.to}>{cta.label}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------------
   Carousel — simple track with prev/next for "Discover more from Brightwell".
   -------------------------------------------------------------------------- */
export function Carousel({ items }) {
  const [index, setIndex] = useState(0);
  const n = items.length;
  if (n === 0) return null;
  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);
  return (
    <div className="-mx-6 overflow-hidden px-6 md:-mx-10 md:px-10">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items.map((it, i) => (
          <div key={i} className="w-full shrink-0 px-1.5 md:w-1/2 xl:w-1/3">
            <OverlayCard item={it} imgSrc={it.img} aspect="aspect-[16/10] md:aspect-[16/10] xl:aspect-[4/3]" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2">
        <button type="button" onClick={prev} aria-label="Previous" className="c-button c-button--primary size-11 rounded-full !p-0">
          <Icon name="chevron-left" />
        </button>
        <button type="button" onClick={next} aria-label="Next" className="c-button c-button--primary size-11 rounded-full !p-0">
          <Icon name="chevron-right" />
        </button>
        <span className="ml-auto text-sm font-medium tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}