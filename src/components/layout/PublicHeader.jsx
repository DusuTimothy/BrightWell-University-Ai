import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Kit.jsx';
import { brand } from '../../data/seed.js';
import { getPortalUser, ROLE_HOMES, logoutPortal } from '../../lib/portalAuth.js';
import cn from '../../lib/cn.js';

const PRIMARY = [
  { to: '/courses', label: 'Browse courses' },
  { to: '/about', label: 'How it works' },
];

function Underline({ className, children }) {
  return <span className={cn('animated-underline animated-underline--off', className)}>{children}</span>;
}

export default function PublicHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [q, setQ] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [menuAccountOpen, setMenuAccountOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const [user, setUser] = useState(() => getPortalUser());

  const overlay = location.pathname === '/';
  const solid = !overlay || scrolled;

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setMenuAccountOpen(false);
  }, [location.pathname]);

  // Re-read the session on route changes so the header stays in sync.
  useEffect(() => {
    const sync = () => setUser(getPortalUser());
    window.addEventListener('storage', sync);
    window.addEventListener('bw-portal-updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('bw-portal-updated', sync);
    };
  }, []);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
        setMenuAccountOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function goSearch(e) {
    e.preventDefault();
    setSearchOpen(false);
    const term = q.trim();
    navigate(`/courses${term ? `?q=${encodeURIComponent(term)}` : ''}`);
  }

  function signOut() {
    logoutPortal();
    window.dispatchEvent(new Event('bw-portal-updated'));
    setUser(null);
    setMenuAccountOpen(false);
    navigate('/');
  }

  const portalHome = user ? ROLE_HOMES[user.role] : '/portal/login';
  const initials = user
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')
    : '';

  return (
    <header
      className={cn(
        'z-50 text-white transition-colors duration-300',
        solid ? 'sticky top-0 bg-brand' : 'absolute inset-x-0 top-0 bg-transparent'
      )}
      data-js-header
    >
      {/* overlay behind dropdowns */}
      <div
        aria-hidden
        onClick={() => {
          setSearchOpen(false);
          setMenuOpen(false);
          setMenuAccountOpen(false);
        }}
        className={cn(
          'pointer-events-none absolute inset-0 z-10 bg-black/50 transition-opacity duration-300',
          searchOpen || menuOpen || menuAccountOpen ? 'opacity-100' : 'opacity-0'
        )}
      />

      <div className="relative border-b border-white/10">
        <div className="c-container flex items-center gap-4 py-4">
          <Link to="/" className="flex items-center gap-3" aria-label={`${brand.name} home`}>
            <span
              className="grid size-10 place-items-center rounded-md bg-cyan shadow-[0_0_0_2px_rgba(38,210,255,0.35),0_4px_14px_-4px_rgba(38,210,255,0.55)]"
              aria-hidden
            >
              <img src="/crest.svg" alt="" width="28" height="28" className="h-7 w-auto" />
            </span>
            <div className="hidden sm:block">
              <p className="font-heading text-base font-semibold leading-tight text-cyan tracking-tight drop-shadow-[0_1px_2px_rgba(0,33,71,0.45)]">
                {brand.name}
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/75">
                E-learning platform
              </p>
            </div>
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 rounded-[5px] border border-white/10 bg-brand px-3 py-1.5 text-sm lg:flex">
            {PRIMARY.map((p) => (
              <Link
                key={p.to}
                to={p.to}
                className={cn(
                  'rounded-md px-3 py-1.5 transition-colors',
                  location.pathname === p.to ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                <Underline className="group-hover:animated-underline--on">{p.label}</Underline>
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-3">
            <button
              type="button"
              aria-label="Search courses"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(!searchOpen)}
              className="grid size-10 place-items-center rounded-md border border-white/10 bg-brand text-white transition-colors hover:bg-white/5"
            >
              <Icon name="search" className="c-icon--sm fill-cyan" />
            </button>

            {user ? <SignedInMenu user={user} initials={initials} portalHome={portalHome} menuAccountOpen={menuAccountOpen} setMenuAccountOpen={setMenuAccountOpen} signOut={signOut} /> : <SignedOutButtons />}

            <button
              type="button"
              className="grid size-10 place-items-center rounded-md border border-white/10 bg-brand text-white lg:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Icon name="menu" className="c-icon--sm fill-cyan" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- SEARCH OVERLAY ---------- */}
      <div
        className={cn(
          'absolute inset-x-0 top-full overflow-hidden border-t border-white/10 bg-brand text-white',
          searchOpen ? 'max-h-[60vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
        style={{ transition: 'max-height 0.3s ease, opacity 0.25s ease' }}
        aria-hidden={!searchOpen}
      >
        <div className="c-container py-8 md:py-10">
          <form onSubmit={goSearch} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="bw-search-input" className="sr-only">
              Search courses
            </label>
            <div className="relative flex-1">
              <Icon name="search" className="c-icon--sm absolute left-4 top-1/2 -translate-y-1/2 fill-cyan" />
              <input
                id="bw-search-input"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search for a course, subject or topic…"
                autoFocus={searchOpen}
                className="w-full rounded-md border border-cyan/40 bg-white pl-11 pr-4 py-3 text-sm text-royal outline-none placeholder:text-body/60 focus:border-cyan"
              />
            </div>
            <button type="submit" className="c-button c-button--primary">
              Search
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
            <span>Try:</span>
            {['Mathematics', 'Physics', 'Computer Science', 'Biology', 'Economics'].map((t) => (
              <Link
                key={t}
                to={`/courses?q=${encodeURIComponent(t)}`}
                onClick={() => setSearchOpen(false)}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-cyan hover:text-white"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- MOBILE MENU ---------- */}
      <div
        className={cn(
          'absolute inset-x-0 top-full overflow-hidden border-t border-white/10 bg-brand text-white lg:hidden',
          menuOpen ? 'max-h-[60vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        )}
        style={{ transition: 'max-height 0.3s ease, opacity 0.25s ease' }}
        aria-hidden={!menuOpen}
      >
        <div className="c-container py-6">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {PRIMARY.map((p) => (
                <li key={p.to} className="border-t border-white/10 first:border-0">
                  <Link
                    to={p.to}
                    onClick={() => setMenuOpen(false)}
                    className="group flex w-full items-center justify-between py-4 text-left font-heading text-lg"
                  >
                    <Underline className="group-hover:animated-underline--on">{p.label}</Underline>
                    <Icon name="chevron-right" className="c-icon--sm fill-cyan" />
                  </Link>
                </li>
              ))}
              {user && (
                <li className="border-t border-white/10">
                  <Link
                    to={portalHome}
                    onClick={() => setMenuOpen(false)}
                    className="group flex w-full items-center justify-between py-4 text-left font-heading text-lg"
                  >
                    <span>
                      <span className="block text-xs font-normal text-cyan">Signed in as {user.name}</span>
                      <Underline className="group-hover:animated-underline--on">Go to dashboard</Underline>
                    </span>
                    <Icon name="chevron-right" className="c-icon--sm fill-cyan" />
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SignedOutButtons() {
  return (
    <>
      <Link
        to="/portal/login"
        className="hidden items-center gap-2 rounded-md border border-white/10 bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5 lg:inline-flex"
      >
        Sign in
        <Icon name="chevron-right" className="c-icon--sm fill-cyan" />
      </Link>
      <Link
        to="/portal/login"
        className="rounded-md bg-cyan px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-cyan-deep hover:text-white lg:hidden"
      >
        Sign in
      </Link>
    </>
  );
}

function SignedInMenu({ user, initials, portalHome, menuAccountOpen, setMenuAccountOpen, signOut }) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={menuAccountOpen}
        onClick={() => setMenuAccountOpen(!menuAccountOpen)}
        className="flex items-center gap-3 rounded-md border border-white/10 bg-brand py-1.5 pl-1.5 pr-3 text-sm text-white transition-colors hover:bg-white/5"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent font-heading text-xs text-white">
          {initials}
        </span>
        <span className="hidden flex-col text-left leading-tight lg:flex">
          <span className="text-[10px] uppercase tracking-widest text-cyan">Signed in</span>
          <span className="text-sm font-semibold">{user.name}</span>
        </span>
        <Icon name="chevron-down" className="c-icon--xs fill-cyan/70" />
      </button>

      <div
        role="menu"
        className={cn(
          'absolute right-0 top-full z-20 mt-2 w-56 origin-top-right overflow-hidden rounded-lg bg-white text-royal shadow-2xl ring-1 ring-black/5 transition-all',
          menuAccountOpen ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-1'
        )}
      >
        <div className="border-b border-line px-4 py-3">
          <p className="text-sm font-semibold text-heading">{user.name}</p>
          <p className="truncate text-xs text-body">{user.email || user.username}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-accent">{user.title}</p>
        </div>
        <Link
          to={portalHome}
          onClick={() => setMenuAccountOpen(false)}
          role="menuitem"
          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-band"
        >
          <Icon name="layout-dashboard" className="c-icon--sm fill-accent" />
          Go to dashboard
        </Link>
        <Link
          to="/portal/student/courses"
          onClick={() => setMenuAccountOpen(false)}
          role="menuitem"
          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-band"
        >
          <Icon name="book-open" className="c-icon--sm fill-accent" />
          My courses
        </Link>
        <Link
          to="/courses"
          onClick={() => setMenuAccountOpen(false)}
          role="menuitem"
          className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-band"
        >
          <Icon name="search" className="c-icon--sm fill-accent" />
          Browse catalogue
        </Link>
        <button
          type="button"
          onClick={signOut}
          role="menuitem"
          className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <Icon name="arrow-right" className="c-icon--sm" />
          Sign out
        </button>
      </div>
    </div>
  );
}