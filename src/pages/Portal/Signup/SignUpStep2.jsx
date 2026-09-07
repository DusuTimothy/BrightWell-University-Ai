import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../../../components/ui/Kit.jsx';
import { saveSignupDraft, loadSignupDraft } from '../../../lib/portalAuth.js';
import { learningCourses } from '../../../data/learning.js';
import { SignupShell } from './SignUpStep1.jsx';
import SignupStepper from './SignupStepper.jsx';
import cn from '../../../lib/cn.js';

const SUBJECTS = Array.from(new Set(learningCourses.map((c) => c.subject))).sort();

export default function SignUpStep2() {
  const navigate = useNavigate();
  const draft = loadSignupDraft() || {};

  useEffect(() => {
    if (!draft.email || !draft.fullName) {
      navigate('/portal/signup', { replace: true });
    }
  }, [draft.email, draft.fullName, navigate]);

  const [role, setRole] = useState(draft.role || 'student');
  const [branch, setBranch] = useState(draft.branch || 'secondary');
  const [subject, setSubject] = useState(draft.subject || '');
  const [org, setOrg] = useState(draft.org || '');

  useEffect(() => {
    saveSignupDraft({ ...draft, role, branch, subject, org });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, branch, subject, org]);

  function next() {
    navigate('/portal/signup/preferences');
  }

  const roleOptions = [
    {
      value: 'student',
      title: 'Learner',
      icon: 'graduation-cap',
      copy: 'Browse courses, take quizzes, submit assignments.',
    },
    {
      value: 'teacher',
      title: 'Instructor',
      icon: 'users',
      copy: 'Author courses, build a question bank, grade work.',
    },
    {
      value: 'admin',
      title: 'Administrator',
      icon: 'shield',
      copy: 'Oversee the platform — users, courses, finance.',
    },
  ];

  return (
    <SignupShell>
      <SignupStepper current={2} />

      <h1 className="h2 mt-8 text-heading">Tell us about you</h1>
      <p className="mt-2 text-sm text-body">Step 2 of 3 — pick a role and any specialisations so we can tailor your dashboard.</p>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-heading">I am joining as a…</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {roleOptions.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRole(r.value)}
              className={cn(
                'flex flex-col items-start rounded-lg border-2 p-4 text-left transition-colors',
                role === r.value ? 'border-accent bg-accent/10' : 'border-line bg-paper hover:border-accent/60'
              )}
            >
              <span className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full',
                role === r.value ? 'bg-brand text-cyan' : 'bg-band text-body'
              )}>
                <Icon name={r.icon} className="c-icon--sm" />
              </span>
              <span className="mt-3 block text-sm font-semibold text-heading">{r.title}</span>
              <span className="mt-1 block text-xs leading-relaxed text-body/80">{r.copy}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-5">
        {role === 'student' && (
          <div>
            <p className="mb-3 text-sm font-semibold text-heading">Pick your branch</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: 'secondary', label: 'Secondary School', tag: 'JSS / SSS' },
                { id: 'university', label: 'University', tag: 'Undergraduate / Graduate' },
                { id: 'all', label: 'Skip — show everything', tag: null },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBranch(b.id)}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-colors',
                    branch === b.id ? 'border-accent bg-accent/10' : 'border-line bg-paper hover:border-accent/60'
                  )}
                >
                  <span className="block text-sm font-semibold text-heading">{b.label}</span>
                  {b.tag && <span className="block text-xs text-body/70">{b.tag}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {role === 'teacher' && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-heading">Subject specialisation</span>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            >
              <option value="">Select a subject…</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-body/70">We'll seed a demo course in this subject.</span>
          </label>
        )}

        {role === 'admin' && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-heading">Organisation name (optional)</span>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="e.g. Brightwell Academy"
              className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </label>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Link to="/portal/signup" className="text-sm font-semibold text-accent hover:underline">
          ← Back
        </Link>
        <button
          type="button"
          onClick={next}
          disabled={role === 'teacher' && !subject}
          className="rounded-md bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-brand disabled:opacity-40"
        >
          Continue →
        </button>
      </div>
    </SignupShell>
  );
}