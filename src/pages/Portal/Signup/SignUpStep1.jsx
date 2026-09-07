import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Kit.jsx';
import { brand } from '../../../data/seed.js';
import { saveSignupDraft, loadSignupDraft, emailExists, createAccount } from '../../../lib/portalAuth.js';
import SignupStepper from './SignupStepper.jsx';
import cn from '../../../lib/cn.js';

export default function SignUpStep1() {
  const navigate = useNavigate();
  const draft = loadSignupDraft() || {};
  const [email, setEmail] = useState(draft.email || '');
  const [fullName, setFullName] = useState(draft.fullName || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    saveSignupDraft({ ...draft, email, fullName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName]);

  const errors = {
    email: !email ? 'Email is required.' : !/^\S+@\S+\.\S+$/.test(email) ? 'Enter a valid email.' : emailExists(email) ? 'An account with this email exists. Sign in instead.' : '',
    fullName: !fullName ? 'Full name is required.' : fullName.trim().length < 2 ? 'At least 2 characters.' : '',
    password: !password ? 'Password is required.' : password.length < 8 ? '8+ characters.' : !/[A-Za-z]/.test(password) || !/\d/.test(password) ? 'Must contain a letter and a number.' : '',
    confirm: !confirm ? 'Please confirm.' : confirm !== password ? 'Passwords do not match.' : '',
  };

  const valid = !errors.email && !errors.fullName && !errors.password && !errors.confirm;

  function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    saveSignupDraft({ email, fullName, password });
    navigate('/portal/signup/profile');
  }

  return (
    <SignupShell>
      <SignupStepper current={1} />

      <h1 className="h2 mt-8 text-heading">Create your account</h1>
      <p className="mt-2 text-sm text-body">Step 1 of 3 — your identity. Used to sign in and on certificates.</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <Field label="Email" error={touched && errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputCls(touched && errors.email)}
            autoComplete="email"
          />
        </Field>

        <Field label="Full name" error={touched && errors.fullName}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Chidinma Okafor"
            className={inputCls(touched && errors.fullName)}
            autoComplete="name"
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" error={touched && errors.password}>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                className={inputCls(touched && errors.password, 'pr-11')}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid size-8 place-items-center rounded-md text-body/60 hover:bg-band hover:text-heading"
              >
                <Icon name={showPwd ? 'eye-off' : 'eye'} className="c-icon--sm" />
              </button>
            </div>
            <PasswordMeter value={password} />
          </Field>

          <Field label="Confirm password" error={touched && errors.confirm}>
            <input
              type={showPwd ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className={inputCls(touched && errors.confirm)}
              autoComplete="new-password"
            />
          </Field>
        </div>

        <p className="text-xs leading-relaxed text-body/70">
          By creating an account you agree to the demo Terms and Privacy Notice. Demo only — no data leaves your browser.
        </p>

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link to="/portal/login" className="text-sm font-semibold text-accent hover:underline">
            ← Back to sign in
          </Link>
          <button
            type="submit"
            className="rounded-sm bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:opacity-40"
            disabled={touched && !valid}
          >
            Continue →
          </button>
        </div>
      </form>
    </SignupShell>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-heading">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(hasError, extra = '') {
  return cn(
    'w-full rounded-sm border bg-white px-4 py-3 text-sm outline-none transition-colors',
    hasError ? 'border-red-300 focus:border-red-500' : 'border-line focus:border-accent',
    extra
  );
}

function PasswordMeter({ value }) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const tones = ['bg-line', 'bg-red-500', 'bg-amber-500', 'bg-cyan', 'bg-emerald-500'];
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn('h-1 flex-1 rounded-full transition-colors', i < score ? tones[score] : 'bg-line')}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-body/70">{value ? labels[score] : '—'}</span>
    </div>
  );
}

export function SignupShell({ children }) {
  return (
    <div className="dark relative min-h-screen overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute left-0 top-[-10%] -translate-y-[5%] opacity-90">
        <img src="/crest.svg" alt="" className="watermark w-[42rem] max-w-none" />
      </div>
      <div className="c-container relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-cyan shadow-[0_0_0_2px_rgba(38,210,255,0.35)]" aria-hidden>
              <img src="/crest.svg" alt="" width="28" height="28" className="h-7 w-auto" />
            </span>
            <div>
              <p className="font-heading text-base font-semibold leading-tight text-cyan tracking-tight">{brand.name}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/75">Create account</p>
            </div>
          </Link>
          <Link to="/portal/login" className="text-sm text-cyan hover:text-white">
            Already have an account? Sign in →
          </Link>
        </header>

        <div className="mx-auto w-full max-w-2xl flex-1 py-8 text-royal">
          <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-white/20 md:p-10">
            {children}
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {brand.name}
        </footer>
      </div>
    </div>
  );
}