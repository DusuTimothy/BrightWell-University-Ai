import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui/Kit.jsx';
import { RoleBadge } from '../../components/portal/PortalKit.jsx';
import { loginPortal, PORTAL_CREDENTIALS, ROLE_HOMES, ROLE_LABELS } from '../../lib/portalAuth.js';
import { school } from '../../data/school.js';
import cn from '../../lib/cn.js';

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function pickRole(r) {
    setRole(r);
    setError('');
    const cred = PORTAL_CREDENTIALS.find((c) => c.role === r);
    setUsername(cred.username);
    setPassword('');
  }

  function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = loginPortal(username, password);
      navigate(ROLE_HOMES[session.role], { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute left-0 top-[-10%] -translate-y-[5%] opacity-90">
        <img src="/crest.svg" alt="" className="watermark w-[42rem] max-w-none" />
      </div>
      <div aria-hidden className="absolute -bottom-40 right-0 overflow-hidden rounded-full opacity-90">
        <img src="/crest.svg" alt="" className="watermark w-[34rem] max-w-none opacity-20" />
      </div>

      <div className="c-container relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-3">
            <img src="/crest.svg" alt="" width="44" height="44" />
            <div>
              <p className="font-heading text-lg leading-tight text-heading">{school.name}</p>
              <p className="text-[11px] uppercase tracking-widest text-cyan">Staff &amp; Student Portal</p>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-cyan hover:text-white">
            <Icon name="chevron-left" className="c-icon--sm -scale-x-100" />
            Back to the website
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <h1 className="h1 text-heading">One portal for the whole school.</h1>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-navy-body">
              Results, timetables, fees, attendance and announcements — in one place for administrators, teachers and students.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-navy-body">
              {[
                ['bank', 'School administration — students, staff, classes, fees and grades'],
                ['award', 'Teachers — rosters, grade entry and their weekly timetable'],
                ['graduation-cap', 'Students — results, timetable, fees and school news'],
              ].map(([icon, text]) => (
                <p key={text} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md bg-white/10">
                    <Icon name={icon} className="c-icon--sm fill-cyan" />
                  </span>
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md justify-self-center lg:justify-self-end">
            <form onSubmit={submit} className="rounded-2xl bg-white p-6 text-royal shadow-2xl ring-1 ring-white/20 md:p-8">
              <h2 className="h3 mb-1 text-heading">Sign in to the portal</h2>
              <p className="mb-6 text-sm text-body">Choose a role to auto-fill the demo account.</p>

              <div role="tablist" aria-label="Portal role" className="mb-6 grid grid-cols-3 gap-2 rounded-lg bg-off-white-50 p-1.5">
                {['admin', 'teacher', 'student'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="tab"
                    aria-selected={role === r}
                    onClick={() => pickRole(r)}
                    className={cn(
                      'rounded-md py-2 text-sm font-semibold transition-colors',
                      role === r ? 'bg-accent text-white shadow-sm' : 'text-body hover:text-heading'
                    )}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>

              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm font-semibold">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
                />
              </label>

              <label className="mb-4 block">
                <span className="mb-1.5 block text-sm font-semibold">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo password"
                  className="w-full rounded-md border border-line bg-white px-4 py-3 text-sm outline-none focus:border-accent"
                />
              </label>

              {error && (
                <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-accent py-3 font-semibold text-white transition-colors hover:bg-brand disabled:opacity-60"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>

              <div className="mt-6 rounded-lg bg-off-white-50 p-4 text-xs leading-relaxed text-body">
                <p className="mb-1 font-semibold text-heading">Demo accounts</p>
                {PORTAL_CREDENTIALS.map((c) => (
                  <p key={c.role} className="mt-1 flex items-center justify-between gap-2">
                    <span className="capitalize">{c.role}</span>
                    <span className="flex items-center gap-2 text-body/80">
                      <code>{c.username}</code>/<code>{c.password}</code>
                    </span>
                  </p>
                ))}
              </div>
            </form>
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {school.name} · {school.address}
        </footer>
      </div>
    </div>
  );
}