import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Kit.jsx';
import { Button } from '../ui/Kit.jsx';
import { brand, IMG } from '../../data/seed.js';
import cn from '../../lib/cn.js';

/* Oxford-style top-bar pill: Admissions | News | Research */
const UTILITY = [
  { to: '/admissions', label: 'Admissions' },
  { to: '/news', label: 'News' },
  { to: '/research', label: 'Research' },
];

/* Full-screen menu structure (drilldown like ox.ac.uk) */
const MENU = [
  {
    label: 'Admissions',
    href: '/admissions',
    children: [
      ['/admissions', 'Undergraduate admissions'],
      ['/admissions', 'Graduate admissions'],
      ['/courses', 'Courses A–Z'],
      ['/admissions', 'Fees and funding'],
      ['/admissions', 'Access Brightwell'],
      ['/events', 'Open days'],
    ],
  },
  {
    label: 'Courses',
    href: '/courses',
    children: [
      ['/courses', 'All courses A–Z'],
      ['/courses', 'Undergraduate courses'],
      ['/courses', 'Graduate courses'],
      ['/courses', 'How to apply'],
    ],
  },
  {
    label: 'News',
    href: '/news',
    children: [
      ['/news', 'Latest news'],
      ['/news', 'Research news'],
      ['/news', 'Health and medicine'],
      ['/news', 'Student stories'],
      ['/news', 'Awards and funding'],
    ],
  },
  {
    label: 'Research',
    href: '/research',
    children: [
      ['/research', 'Research at Brightwell'],
      ['/research', 'Research institutes'],
      ['/research', 'Our researchers'],
      ['/news', 'Research news'],
    ],
  },
  {
    label: 'About',
    href: '/about',
    children: [
      ['/about', 'The University'],
      ['/about', 'Colleges and halls'],
      ['/about', 'History'],
      ['/about', 'Libraries and collections'],
      ['/contact', 'Contact and visiting'],
    ],
  },
  { label: 'Events', href: '/events', children: [['/events', 'What’s on'], ['/events', 'Open days']] },
  { label: 'Students', href: '/student-life', children: [['/student-life', 'Student life'], ['/student-life', 'Accommodation'], ['/student-life', 'Clubs and societies']] },
  { label: 'Staff', href: '/about#staff', children: [['/about#staff', 'For staff'], ['/about', 'Jobs'], ['/student-life', 'Wellbeing support']] },
];

function Underline({ className, children }) {
  return <span className={cn('animated-underline animated-underline--off', className)}>{children}</span>;
}

export default function PublicHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stack, setStack] = useState([]);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  const overlay = location.pathname === '/';
  const solid = !overlay || scrolled;

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setStack([]);
  }, [location.pathname]);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) setStack([]);
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
        setStack([]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openAt = (i) => setStack([i]);

  function goSearch(e) {
    e.preventDefault();
    setSearchOpen(false);
    const term = q.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  }

  const current = stack.length > 0 ? MENU[stack[stack.length - 1]] : null;

  return (
    <header
      className={cn(
        'z-210 text-white transition-colors duration-300',
        solid ? 'dark sticky top-0 bg-transparent' : 'absolute inset-x-0 top-0 bg-transparent'
      )}
      data-js-header
    >
      {/* overlay behind dropdowns */}
      <div
        aria-hidden
        onClick={() => {
          setSearchOpen(false);
          setMenuOpen(false);
          setStack([]);
        }}
        className={cn(
          'pointer-events-none absolute inset-0 z-10 bg-black/50 transition-opacity duration-300',
          searchOpen || menuOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div className="relative border-b border-white/10">
        <div className="c-container flex items-center gap-4 py-4">
          <Link to="/" className="mr-auto shrink-0" aria-label="Brightwell University home">
            <img src="/crest.svg" alt="" width="56" height="56" className="h-14 w-auto" />
          </Link>

          <ul
            className={cn(
              'hidden items-center gap-5 rounded-[5px] border px-5 py-2 text-sm lg:flex',
              solid ? 'border-white/10 bg-brand' : 'border-white/25 bg-brand backdrop-blur-sm'
            )}
          >
            {UTILITY.map((u) => (
              <li key={u.label} className="group">
                <Link to={u.to}>
                  <Underline className="group-hover:animated-underline--on">{u.label}</Underline>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              'flex items-center gap-5 rounded-[5px] border px-5 py-2 text-sm',
              solid ? 'border-white/10 bg-brand' : 'border-white/25 bg-brand backdrop-blur-sm'
            )}
          >
            <button type="button" className="group flex items-center gap-2 font-medium" aria-expanded={searchOpen} aria-controls="bw-search" onClick={() => setSearchOpen(!searchOpen)}>
              <Underline className="group-hover:animated-underline--on">Search</Underline>
              <Icon name="search" className="c-icon--sm fill-cyan" />
            </button>
            <button type="button" className="group flex items-center gap-2 font-medium" aria-expanded={menuOpen} aria-controls="bw-menu" onClick={() => setMenuOpen(true)}>
              <Underline className="group-hover:animated-underline--on">Menu</Underline>
              <Icon name="menu" className="c-icon--sm fill-cyan" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- SEARCH OVERLAY ---------- */}
      <div
        id="bw-search"
        className={cn(
          'absolute inset-x-0 top-full overflow-hidden border-t border-white/10 bg-brand text-white',
          searchOpen ? 'max-h-[88vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
        style={{ transition: 'max-height 0.35s ease, opacity 0.3s ease' }}
        aria-hidden={!searchOpen}
      >
        <div className="relative overflow-hidden">
          <div aria-hidden className="absolute left-0 top-[-15%] -translate-y-[5%]">
            <img src="/crest.svg" alt="" className="watermark w-[46rem] max-w-none" />
          </div>
          <div className="c-container relative py-12 md:py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="h1 mb-4">Search Brightwell</h2>
              <p className="mb-8 leading-relaxed text-navy-body">
                Search the Brightwell University website, or search our undergraduate and graduate courses.
              </p>
              <form onSubmit={goSearch} className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="bw-search-input" className="sr-only">
                  Search Brightwell
                </label>
                <input
                  id="bw-search-input"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full rounded-md border border-cyan/40 bg-white px-4 py-3 text-sm text-royal outline-none placeholder:text-body/60 focus:border-cyan"
                />
                <Button onClick={goSearch}>Search</Button>
              </form>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Button variant="secondary" to="/courses">Undergraduate courses</Button>
                <Button variant="secondary" to="/courses">Graduate courses</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MENU OVERLAY ---------- */}
      <div
        id="bw-menu"
        className={cn(
          'absolute inset-x-0 top-full overflow-hidden border-t border-white/10 bg-brand text-white',
          menuOpen ? 'max-h-[88vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
        style={{ transition: 'max-height 0.35s ease, opacity 0.3s ease' }}
        aria-hidden={!menuOpen}
      >
        <div className="relative">
          <div aria-hidden className="absolute left-0 top-[-15%] -translate-y-[5%]">
            <img src="/crest.svg" alt="" className="watermark w-[46rem] max-w-none" />
          </div>
          <div ref={menuRef} className="c-container relative grid gap-10 py-8 md:py-12 lg:grid-cols-12">
            {/* drilldown panes */}
            <div className="relative min-h-[22rem] lg:col-span-7">
              <div className={cn('transition-opacity', stack.length === 0 ? 'opacity-100' : 'pointer-events-none opacity-0')}>
                <ul>
                  {MENU.map((item, i) => (
                    <li key={item.label} className="border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => openAt(i)}
                        className="group flex w-full items-center justify-between py-4 text-left font-heading text-xl focus-visible:outline-none md:justify-start md:gap-8"
                      >
                        <Underline className="group-hover:animated-underline--on">{item.label}</Underline>
                        <Icon name="arrow" className="c-icon--sm -rotate-90 fill-cyan" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {current && (
                <div className="animate-fade-block absolute inset-0">
                  <button
                    type="button"
                    onClick={() => setStack(stack.slice(0, -1))}
                    className="group flex w-full items-center gap-2 border-b border-white/10 py-4 text-left"
                  >
                    <Icon name="chevron-left" className="c-icon--sm -scale-x-100" />
                    <Underline className="group-hover:animated-underline--on">Go back</Underline>
                  </button>
                  <Link
                    to={current.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-white/10 py-4 font-heading text-xl"
                  >
                    <Underline className="animated-underline--on">{current.label}</Underline>
                  </Link>
                  <ul className="pt-2">
                    {current.children.map(([to, label]) => (
                      <li key={label}>
                        <Link to={to} onClick={() => setMenuOpen(false)} className="group flex w-full items-center justify-between py-3 text-left">
                          <span className="text-white/85 transition-colors group-hover:text-white">{label}</span>
                          <Icon name="chevron-down" className="c-icon--xs -rotate-90 fill-cyan" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* promo card */}
            <div className="hidden lg:col-span-5 lg:block">
              <div className="dark overflow-hidden rounded-md bg-brand ring-1 ring-white/10">
                <div className="overflow-hidden">
                  <img src={IMG.graduation} alt="" className="aspect-[16/9] h-44 w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="h4 text-heading">Support Brightwell</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-body">
                    Together, let’s turn today’s biggest challenges into tomorrow’s boldest breakthroughs.
                  </p>
                  <div className="mt-4">
                    <Button to="/about">Discover more</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      </header>
  );
}