import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Kit.jsx';
import { saveSignupDraft, loadSignupDraft, clearSignupDraft, createAccount } from '../../../lib/portalAuth.js';
import { SignupShell } from './SignUpStep1.jsx';
import SignupStepper from './SignupStepper.jsx';
import cn from '../../../lib/cn.js';

const AVATARS = [
  { id: 'indigo', color: '#1d42a6' },
  { id: 'slate',  color: '#475569' },
  { id: 'sand',   color: '#a98a5b' },
  { id: 'mint',   color: '#0d9488' },
];

const GOALS = [
  { id: 'pass',     label: 'Pass my finals' },
  { id: 'try-new',  label: 'Try a new subject' },
  { id: 'teach',    label: 'Teach others' },
];

export default function SignUpStep3() {
  const navigate = useNavigate();
  const draft = loadSignupDraft() || {};

  useEffect(() => {
    if (!draft.email || !draft.fullName || !draft.role) {
      navigate('/portal/signup', { replace: true });
    }
  }, [draft.email, draft.fullName, draft.role, navigate]);

  const [avatar, setAvatar] = useState(draft.avatar || 'indigo');
  const [goal, setGoal] = useState(draft.goal || '');
  const [demoData, setDemoData] = useState(draft.demoData !== false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    saveSignupDraft({ ...draft, avatar, goal, demoData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar, goal, demoData]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await createAccount({
        email: draft.email,
        fullName: draft.fullName,
        password: draft.password,
        role: draft.role,
        branch: draft.branch,
        subject: draft.subject,
        org: draft.org,
        avatar,
        goal,
        demoData,
      });
      clearSignupDraft();
      navigate('/portal/signup/done', {
        state: {
          name: session.name,
          role: session.role,
          avatar: session.avatar,
        },
      });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <SignupShell>
      <SignupStepper current={3} />

      <h1 className="h2 mt-8 text-heading">Make it yours</h1>
      <p className="mt-2 text-sm text-body">Step 3 of 3 — pick an avatar and how much demo data you'd like to start with.</p>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-6">
        {/* Avatar */}
        <div>
          <p className="mb-3 text-sm font-semibold text-heading">Avatar colour</p>
          <div className="flex flex-wrap gap-3">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                type="button"
                aria-label={`Avatar ${a.id}`}
                aria-pressed={avatar === a.id}
                onClick={() => setAvatar(a.id)}
                className={cn(
                  'grid size-12 place-items-center rounded-full font-heading text-base text-white transition-transform',
                  avatar === a.id ? 'ring-2 ring-accent ring-offset-2 scale-110' : 'ring-2 ring-transparent'
                )}
                style={{ background: a.color }}
              >
                {(draft.fullName || 'You').split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <p className="mb-3 text-sm font-semibold text-heading">What's your main goal? (optional)</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGoal(goal === g.id ? '' : g.id)}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors',
                  goal === g.id ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-paper text-body hover:border-accent/60'
                )}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo data */}
        <div>
          <p className="mb-3 text-sm font-semibold text-heading">Demo data</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-paper p-4">
            <input
              type="checkbox"
              checked={demoData}
              onChange={(e) => setDemoData(e.target.checked)}
              className="mt-0.5 size-4 accent-[#1d42a6]"
            />
            <span>
              <span className="block text-sm font-semibold text-heading">Seed 3 demo courses in my dashboard</span>
              <span className="block text-xs text-body/80">
                Recommended for a guided tour. You can clear it from your dashboard any time.
              </span>
            </span>
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Link to="/portal/signup/profile" className="text-sm font-semibold text-accent hover:underline">
            ← Back
          </Link>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:opacity-60"
          >
            {busy ? 'Creating…' : 'Create my account'}
            <Icon name="arrow" className="c-icon--sm" />
          </button>
        </div>
      </form>
    </SignupShell>
  );
}