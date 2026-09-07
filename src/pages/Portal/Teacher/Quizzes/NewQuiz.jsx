import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge } from '../../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../../components/ui/Kit.jsx';
import { saveQuiz, newQuizId } from '../../../../data/quizzes.js';
import { learningCourses } from '../../../../data/learning.js';
import { getPortalUser } from '../../../../lib/portalAuth.js';
import cn from '../../../../lib/cn.js';

const STEPS = [
  ['basics', 'Basics'],
  ['rules', 'Rules'],
  ['availability', 'Availability'],
  ['review', 'Review'],
];

export default function NewQuiz() {
  const navigate = useNavigate();
  const user = getPortalUser();
  const [step, setStep] = useState('basics');
  const [draft, setDraft] = useState({
    id: newQuizId(),
    instructorId: user.id,
    title: '',
    description: '',
    courseId: learningCourses[0]?.slug || '',
    moduleId: null,
    type: 'graded',
    status: 'draft',
    questions: [],
    poolSize: null,
    rules: { timeLimitMin: 30, attempts: 3, passingScore: 50, layout: 'paginated', feedbackMode: 'after_due' },
    availability: { from: '', until: '' },
    antiCheat: { trackFocus: true, maxFocusLosses: 3, fullscreen: false },
    createdAt: new Date().toISOString().slice(0, 10),
  });

  function patch(p) { setDraft((d) => ({ ...d, ...p })); }
  function patchRules(p) { setDraft((d) => ({ ...d, rules: { ...d.rules, ...p } })); }
  function patchAvail(p) { setDraft((d) => ({ ...d, availability: { ...d.availability, ...p } })); }
  function patchAntiCheat(p) { setDraft((d) => ({ ...d, antiCheat: { ...d.antiCheat, ...p } })); }

  function publish() {
    if (!draft.title.trim()) return;
    saveQuiz({ ...draft, status: 'live' });
    navigate(`/portal/teacher/quizzes/${draft.id}`);
  }
  function saveDraft() {
    if (!draft.title.trim()) return;
    saveQuiz(draft);
    navigate(`/portal/teacher/quizzes/${draft.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/portal/teacher/quizzes" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        All quizzes
      </Link>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5">
          <div>
            <h1 className="h3 text-heading">{draft.title || 'New quiz'}</h1>
            <p className="mt-1 text-sm text-body">Draft · saved locally as you go.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveDraft} className="c-button c-button--secondary !py-2.5">
              <Icon name="save" className="c-icon--sm" />
              Save draft
            </button>
            <button type="button" onClick={publish} className="c-button c-button--primary !py-2.5">
              Publish
              <Icon name="arrow" className="c-icon--sm" />
            </button>
          </div>
        </div>

        <nav className="flex overflow-x-auto border-b border-line bg-band/40 p-2">
          {STEPS.map(([id, label], i) => (
            <button
              key={id}
              type="button"
              onClick={() => setStep(id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                step === id ? 'bg-accent text-white shadow-sm' : 'text-body hover:bg-paper hover:text-heading'
              )}
            >
              <span className={cn('grid size-6 place-items-center rounded-full text-xs', step === id ? 'bg-white/20' : 'bg-band')}>{i + 1}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="p-5">
          {step === 'basics' && (
            <div className="flex flex-col gap-5">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Title <span className="text-red-500">*</span></span>
                <input type="text" value={draft.title} onChange={(e) => patch({ title: e.target.value })} placeholder="e.g. Core Mathematics — Unit test" className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Description</span>
                <textarea value={draft.description} onChange={(e) => patch({ description: e.target.value })} rows={2} className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Course</span>
                <select value={draft.courseId} onChange={(e) => patch({ courseId: e.target.value })} className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent">
                  {learningCourses.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </label>
              <fieldset>
                <legend className="mb-2 block text-sm font-semibold">Quiz type</legend>
                <div className="flex gap-2">
                  {['graded', 'practice', 'diagnostic'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => patch({ type: t })}
                      className={cn(
                        'rounded-md border-2 px-4 py-2 text-sm font-semibold capitalize',
                        draft.type === t ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-paper text-body hover:border-accent/60'
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <p className="mb-2 text-sm font-semibold">Questions</p>
                <Link to={`/portal/teacher/quizzes/${draft.id}`} className="text-sm text-accent hover:underline">
                  Add questions after saving the draft →
                </Link>
                <p className="mt-1 text-xs text-body/70">You'll choose questions from your question bank in the next step.</p>
              </div>
            </div>
          )}

          {step === 'rules' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Time limit</p>
                <div className="flex items-center gap-3">
                  <input type="number" min="1" value={draft.rules.timeLimitMin} onChange={(e) => patchRules({ timeLimitMin: Number(e.target.value) })} className="w-24 rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
                  <span className="text-sm text-body">minutes (0 for no limit)</span>
                </div>
              </Card>
              <Card className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Attempts allowed</p>
                <div className="flex items-center gap-3">
                  <input type="number" min="1" value={draft.rules.attempts} onChange={(e) => patchRules({ attempts: Number(e.target.value) })} className="w-24 rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
                  <span className="text-sm text-body">(0 for unlimited)</span>
                </div>
              </Card>
              <Card className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Passing score</p>
                <div className="flex items-center gap-3">
                  <input type="number" min="0" max="100" value={draft.rules.passingScore} onChange={(e) => patchRules({ passingScore: Number(e.target.value) })} className="w-24 rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
                  <span className="text-sm text-body">percent</span>
                </div>
              </Card>
              <Card className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Layout</p>
                <Segmented value={draft.rules.layout} onChange={(v) => patchRules({ layout: v })} options={[['paginated', 'One per page'], ['single', 'All on one'], ['sectioned', 'Sectioned']]} />
              </Card>
              <Card className="p-4 sm:col-span-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Feedback mode</p>
                <Segmented value={draft.rules.feedbackMode} onChange={(v) => patchRules({ feedbackMode: v })} options={[['immediate', 'Immediate'], ['after_due', 'After due date'], ['manual', 'Manual release']]} />
              </Card>
            </div>
          )}

          {step === 'availability' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Opens</span>
                <input type="date" value={draft.availability.from || ''} onChange={(e) => patchAvail({ from: e.target.value })} className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">Closes</span>
                <input type="date" value={draft.availability.until || ''} onChange={(e) => patchAvail({ until: e.target.value })} className="w-full rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent" />
              </label>
              <Card className="p-4 sm:col-span-2">
                <p className="text-sm font-semibold text-heading">Anti-cheat defaults</p>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center justify-between">
                    <span>Track tab-switch / window-blur</span>
                    <input type="checkbox" checked={draft.antiCheat.trackFocus} onChange={(e) => patchAntiCheat({ trackFocus: e.target.checked })} className="size-4 accent-[#1d42a6]" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Offer fullscreen mode</span>
                    <input type="checkbox" checked={draft.antiCheat.fullscreen} onChange={(e) => patchAntiCheat({ fullscreen: e.target.checked })} className="size-4 accent-[#1d42a6]" />
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Auto-submit after
                      <input type="number" min="1" max="20" value={draft.antiCheat.maxFocusLosses} onChange={(e) => patchAntiCheat({ maxFocusLosses: Number(e.target.value) })} className="mx-1 w-12 rounded-md border border-line bg-paper px-1 py-0.5 text-sm outline-none focus:border-accent" />
                      focus losses</span>
                    <Badge tone="muted">Auto-flagged</Badge>
                  </li>
                </ul>
              </Card>
            </div>
          )}

          {step === 'review' && (
            <div className="flex flex-col gap-3 text-sm">
              <Row k="Title" v={draft.title || '—'} />
              <Row k="Course" v={learningCourses.find((c) => c.slug === draft.courseId)?.title} />
              <Row k="Type" v={draft.type} />
              <Row k="Time limit" v={`${draft.rules.timeLimitMin} min`} />
              <Row k="Attempts" v={draft.rules.attempts || 'Unlimited'} />
              <Row k="Passing score" v={`${draft.rules.passingScore}%`} />
              <Row k="Layout" v={draft.rules.layout} />
              <Row k="Feedback" v={draft.rules.feedbackMode} />
              <Row k="Opens" v={draft.availability.from || 'Anytime'} />
              <Row k="Closes" v={draft.availability.until || 'No close'} />
              <div className="mt-4 rounded-lg bg-band/40 p-4 text-sm">
                <p className="font-semibold text-heading">Ready to publish?</p>
                <p className="mt-1 text-body">Once published, learners will see the quiz in their catalogue subject to availability.</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-band/30 px-4 py-2.5">
      <span className="text-body/80">{k}</span>
      <span className="font-semibold text-heading">{v}</span>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors',
            value === id ? 'bg-accent text-white shadow-sm' : 'text-body hover:text-heading'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}