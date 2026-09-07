import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../components/ui/Kit.jsx';
import { loginPortal, PORTAL_CREDENTIALS, ROLE_HOMES, ROLE_LABELS } from '../../lib/portalAuth.js';
import { brand } from '../../data/seed.js';
import cn from '../../lib/cn.js';

export default function PortalLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
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
            <img src="/crest.svg" alt="" width="40" height="40" />
            <div>
              <p className="font-heading text-base leading-tight text-heading">{brand.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-cyan">Learner portal</p>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-cyan hover:text-white">
            <Icon name="chevron-left" className="c-icon--sm -scale-x-100" />
            Back to the website
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <h1 className="h1 text-heading">One portal for every learner.</h1>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-navy-body">
              Pick up where you left off — watch lessons, take quizzes and submit assignments across every course on the platform.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-navy-body">
              {[
                ['graduation-cap', 'Learners — track progress across all your courses'],
                ['users', 'Instructors — manage your courses and grade assignments'],
                ['bank', 'Administrators — oversee the platform and the catalogue'],
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
            <div className="rounded-2xl bg-white p-6 text-royal shadow-2xl ring-1 ring-white/20 md:p-8">
              {/* Tabs */}
              <div role="tablist" aria-label="Portal access" className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-off-white-50 p-1.5">
                {[
                  ['signin', 'Sign in'],
                  ['signup', 'Create account'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={mode === id}
                    onClick={() => (id === 'signup' ? navigate('/portal/signup') : setMode(id))}
                    className={cn(
                      'rounded-md py-2 text-sm font-semibold transition-colors',
                      mode === id ? 'bg-accent text-white shadow-sm' : 'text-body hover:text-heading'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {mode === 'signin' ? <SignInForm /> : <SignupTeaser />}
            </div>
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {brand.name}
        </footer>
      </div>
    </div>
  );
}

function SignInForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [username, setUsername] = useState('student');
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

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await loginPortal(username, password);
      navigate(ROLE_HOMES[session.role], { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <h2 className="h3 mb-1 text-heading">Sign in to the portal</h2>
      <p className="mb-6 text-sm text-body">Choose a role to auto-fill the demo account, or sign in with your own.</p>

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

      <form onSubmit={submit}>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-semibold">Username or email</span>
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
              <span className="capitalize">{ROLE_LABELS[c.role]}</span>
              <span className="flex items-center gap-2 text-body/80">
                <code>{c.username}</code>/<code>{c.password}</code>
              </span>
            </p>
          ))}
        </div>
      </form>
    </>
  );
}

function SignupTeaser() {
  return (
    <>
      <h2 className="h3 mb-1 text-heading">Create your account</h2>
      <p className="mb-6 text-sm text-body">
        Join Brightwell Academy in three quick steps. Pick your role, give your workspace a name and you're ready to learn.
      </p>
      <ul className="flex flex-col gap-3 text-sm text-body">
        {[
          ['User', 'Your identity'],
          ['Sliders', 'Pick a role and specialisation'],
          ['Sparkles', 'Customise your workspace'],
        ].map(([icon, label], i) => (
          <li key={label} className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-band text-accent">
              <Icon name={icon} className="c-icon--sm" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wide text-accent">Step {i + 1}</span>
              <span className="block font-medium text-heading">{label}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link to="/portal/signup" className="mt-6 block w-full rounded-md bg-accent py-3 text-center font-semibold text-white transition-colors hover:bg-brand">
        Start sign-up →
      </Link>
      <p className="mt-4 text-center text-xs text-body/70">
        Already have an account? Use the Sign in tab.
      </p>
    </>
  );
}