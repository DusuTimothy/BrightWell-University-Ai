import React, { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../../components/ui/Kit.jsx';
import { getQuiz, listAttempts, getBankItem, saveQuiz, deleteQuiz, classAnalytics, recordEssayGrade } from '../../../../data/quizzes.js';
import { learningCourses } from '../../../../data/learning.js';
import { getPortalUser } from '../../../../lib/portalAuth.js';
import cn from '../../../../lib/cn.js';

const TABS = [
  ['overview', 'Overview', 'gauge'],
  ['questions', 'Questions', 'list-checks'],
  ['rules', 'Rules', 'sliders'],
  ['availability', 'Availability', 'calendar-clock'],
  ['antiCheat', 'Anti-cheat', 'shield'],
  ['results', 'Results', 'users'],
  ['manualGrade', 'Manual grading', 'clipboard-check'],
  ['analytics', 'Analytics', 'bar-chart'],
];

export default function TeacherQuizDetail() {
  const { id } = useParams();
  const user = getPortalUser();
  const quiz = getQuiz(id);

  const [tab, setTab] = useState('overview');
  const [tick, setTick] = useState(0);

  if (!quiz) return <Navigate to="/portal/teacher/quizzes" replace />;
  if (quiz.instructorId !== user.id) return <Navigate to="/portal/teacher/quizzes" replace />;

  const course = learningCourses.find((c) => c.slug === quiz.courseId);
  const attempts = listAttempts(quiz.id);
  const analytics = classAnalytics(quiz.id);

  function patch(p) {
    saveQuiz({ ...quiz, ...p });
    setTick((t) => t + 1);
  }

  function remove() {
    if (!confirm('Delete this quiz and all its attempts?')) return;
    deleteQuiz(quiz.id);
    window.location.href = '/portal/teacher/quizzes';
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/portal/teacher/quizzes" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        All quizzes
      </Link>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={quiz.status === 'live' ? 'success' : quiz.status === 'draft' ? 'muted' : 'warn'}>
                {quiz.status}
              </Badge>
              {course && <Badge tone="cyan">{course.title}</Badge>}
              <Badge tone="muted">{quiz.type}</Badge>
            </div>
            <h1 className="h2 mt-2 text-heading">{quiz.title}</h1>
            {quiz.description && <p className="mt-1 text-sm text-body">{quiz.description}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link to={`/portal/student/quizzes/take/${quiz.id}`} className="c-button c-button--secondary !py-2.5">
              <Icon name="play" className="c-icon--sm" />
              Preview
            </Link>
            <button type="button" onClick={remove} className="rounded-sm border border-red-300 bg-paper px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t border-line bg-band/40 p-2">
          {TABS.map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-semibold transition-colors',
                tab === id ? 'bg-accent text-white shadow-sm' : 'text-body hover:bg-paper hover:text-heading'
              )}
            >
              <Icon name={icon} className="c-icon--sm" />
              {label}
            </button>
          ))}
        </div>
      </Card>

      <div key={tick}>
        {tab === 'overview' && <OverviewPanel quiz={quiz} attempts={attempts} analytics={analytics} course={course} />}
        {tab === 'questions' && <QuestionsPanel quiz={quiz} patch={patch} />}
        {tab === 'rules' && <RulesPanel quiz={quiz} patch={patch} />}
        {tab === 'availability' && <AvailabilityPanel quiz={quiz} patch={patch} />}
        {tab === 'antiCheat' && <AntiCheatPanel quiz={quiz} patch={patch} />}
        {tab === 'results' && <ResultsPanel attempts={attempts} />}
        {tab === 'manualGrade' && <ManualGradePanel quiz={quiz} attempts={attempts} />}
        {tab === 'analytics' && <AnalyticsPanel quiz={quiz} analytics={analytics} />}
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */

function OverviewPanel({ quiz, attempts, analytics, course }) {
  const submitted = attempts.filter((a) => a.status === 'submitted');
  const pending = attempts.filter((a) => Object.values(a.grading || {}).some((g) => g.status === 'manual_pending')).length;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <h3 className="h4 mb-3 text-heading">Summary</h3>
        <p className="text-sm text-body">{quiz.description || 'No description.'}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <Field k="Questions" v={`${quiz.questions.length}`} />
          <Field k="Time limit" v={quiz.rules?.timeLimitMin ? `${quiz.rules.timeLimitMin} min` : 'No limit'} />
          <Field k="Attempts allowed" v={quiz.rules?.attempts || 'Unlimited'} />
          <Field k="Passing score" v={`${quiz.rules?.passingScore || 50}%`} />
          <Field k="Layout" v={quiz.rules?.layout || 'paginated'} />
          <Field k="Feedback mode" v={quiz.rules?.feedbackMode || 'after_due'} />
        </dl>
      </Card>

      <Card>
        <h3 className="h4 mb-3 text-heading">Live metrics</h3>
        <ul className="flex flex-col gap-3 text-sm">
          <li className="flex items-center justify-between">
            <span className="text-body">Attempts submitted</span>
            <span className="font-semibold text-heading">{submitted.length}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-body">Pass rate</span>
            <span className="font-semibold text-heading">{analytics.passRate}%</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-body">Median score</span>
            <span className="font-semibold text-heading">{analytics.median}%</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-body">Avg time</span>
            <span className="font-semibold text-heading">{analytics.avgTime} min</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-body">Pending manual grading</span>
            <span className={cn('font-semibold', pending ? 'text-amber-700' : 'text-heading')}>
              {pending}
            </span>
          </li>
        </ul>
        <div className="mt-4 rounded-lg bg-brand/5 p-3 text-xs leading-relaxed text-body">
          Use the tabs above to edit questions, configure rules, schedule availability and review analytics.
        </div>
      </Card>
    </div>
  );
}

/* ---------- Questions ---------- */

function QuestionsPanel({ quiz, patch }) {
  const [adding, setAdding] = useState(false);
  const items = quiz.questions.map((qid) => ({ qid, item: getBankItem(qid) }));

  function reorder(from, to) {
    const next = [...quiz.questions];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    patch({ questions: next });
  }
  function remove(idx) {
    if (!confirm('Remove this question from the quiz?')) return;
    const next = quiz.questions.filter((_, i) => i !== idx);
    patch({ questions: next });
  }
  function append(qid) {
    patch({ questions: [...quiz.questions, qid] });
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="h4 text-heading">{quiz.questions.length} questions</h3>
            <p className="text-sm text-body">Reorder with the up/down arrows. Drag to rearrange.</p>
          </div>
          <button type="button" onClick={() => setAdding(!adding)} className="c-button c-button--secondary !py-2.5">
            <Icon name={adding ? 'cross' : 'plus'} className="c-icon--sm" />
            {adding ? 'Cancel' : 'Add question'}
          </button>
        </div>
        {adding && <AddFromBank onAdd={append} />}
      </Card>

      <ol className="flex flex-col gap-3">
        {items.map(({ qid, item }, idx) => (
          <li key={`${qid}-${idx}`}>
            <Card className="flex items-start gap-3">
              <div className="flex shrink-0 flex-col items-center gap-1 text-body">
                <button type="button" disabled={idx === 0} onClick={() => reorder(idx, idx - 1)} className="rounded-md p-1 hover:bg-band disabled:opacity-30" aria-label="Move up">
                  <Icon name="chevron-right" className="c-icon--sm -rotate-90" />
                </button>
                <span className="font-heading text-sm text-accent">{String(idx + 1).padStart(2, '0')}</span>
                <button type="button" disabled={idx === items.length - 1} onClick={() => reorder(idx, idx + 1)} className="rounded-md p-1 hover:bg-band disabled:opacity-30" aria-label="Move down">
                  <Icon name="chevron-right" className="c-icon--sm rotate-90" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                {item ? (
                  <>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <Badge tone="cyan">{item.type}</Badge>
                      <Badge tone="muted">{item.points} pt{item.points !== 1 ? 's' : ''}</Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium text-heading">{item.prompt}</p>
                  </>
                ) : (
                  <p className="text-sm text-red-600">Question not found in bank (id: {qid})</p>
                )}
              </div>
              <button type="button" onClick={() => remove(idx)} className="grid size-8 shrink-0 place-items-center rounded-md text-body hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                <Icon name="cross" className="c-icon--sm" />
              </button>
            </Card>
          </li>
        ))}
        {items.length === 0 && (
          <Card>
            <p className="py-6 text-center text-sm text-body">No questions yet — add at least one from your bank.</p>
          </Card>
        )}
      </ol>
    </div>
  );
}

function AddFromBank({ onAdd }) {
  const user = getPortalUser();
  const [q, setQ] = useState('');
  const bank = listBank(user.id);
  const filtered = bank.filter((b) => `${b.prompt} ${(b.tags || []).join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="mt-4 rounded-lg bg-band/30 p-3">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search your bank…"
        className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <ul className="mt-2 flex max-h-64 flex-col gap-1 overflow-y-auto">
        {filtered.map((b) => (
          <li key={b.id}>
            <button type="button" onClick={() => onAdd(b.id)} className="flex w-full items-start gap-2 rounded-md p-2 text-left text-sm hover:bg-band">
              <Icon name="plus" className="c-icon--sm shrink-0 fill-accent" />
              <span className="flex-1">
                <span className="block text-xs font-semibold uppercase text-accent">{b.type}</span>
                <span className="block text-heading">{b.prompt}</span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <li className="p-2 text-sm text-body/70">No questions match.</li>}
      </ul>
    </div>
  );
}

/* ---------- Rules ---------- */

function RulesPanel({ quiz, patch }) {
  const rules = quiz.rules || {};
  function setRule(k, v) { patch({ rules: { ...rules, [k]: v } }); }
  return (
    <Card>
      <h3 className="h4 mb-4 text-heading">Quiz rules</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Group title="Time limit">
          <ToggleRow checked={!rules.timeLimitMin} onChange={(c) => setRule('timeLimitMin', c ? null : 20)} label="No limit" />
          <ToggleRow checked={!!rules.timeLimitMin} onChange={(c) => setRule('timeLimitMin', c ? 30 : null)} label="Time limit" suffix={
            <input type="number" min="1" value={rules.timeLimitMin || 30} onChange={(e) => setRule('timeLimitMin', Number(e.target.value))} className="w-20 rounded-sm border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-accent" />
          } suffix2="minutes" />
        </Group>

        <Group title="Attempts">
          <ToggleRow checked={!rules.attempts} onChange={(c) => setRule('attempts', c ? null : 3)} label="Unlimited" />
          <ToggleRow checked={!!rules.attempts} onChange={(c) => setRule('attempts', c ? 3 : null)} label="Maximum" suffix={
            <input type="number" min="1" value={rules.attempts || 3} onChange={(e) => setRule('attempts', Number(e.target.value))} className="w-20 rounded-sm border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-accent" />
          } suffix2="attempts" />
        </Group>

        <Group title="Passing score">
          <div className="flex items-center gap-3">
            <input type="number" min="0" max="100" value={rules.passingScore ?? 50} onChange={(e) => setRule('passingScore', Number(e.target.value))} className="w-24 rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
            <span className="text-sm text-body">percent (used for certificate gate)</span>
          </div>
        </Group>

        <Group title="Question selection">
          <ToggleRow checked={!quiz.poolSize} onChange={(c) => patch({ poolSize: c ? null : { size: quiz.questions.length, draw: Math.max(1, Math.floor(quiz.questions.length / 2)) } })} label="All questions" />
          <ToggleRow checked={!!quiz.poolSize} onChange={(c) => patch({ poolSize: c ? { size: quiz.questions.length, draw: Math.max(1, Math.floor(quiz.questions.length / 2)) } : null })} label="Random" suffix={
            quiz.poolSize ? (
              <>
                <input type="number" min="1" value={quiz.poolSize.draw} onChange={(e) => setRule('poolDraw', Number(e.target.value))} className="w-16 rounded-sm border border-line bg-paper px-2 py-1 text-sm outline-none focus:border-accent" />
                <span className="text-xs text-body/70">of {quiz.poolSize.size}</span>
              </>
            ) : null
          } suffix2="questions" />
        </Group>

        <Group title="Layout">
          <Segmented value={rules.layout || 'paginated'} options={[
            ['paginated', 'One per page'],
            ['single', 'All on one page'],
            ['sectioned', 'Sectioned'],
          ]} onChange={(v) => setRule('layout', v)} />
        </Group>

        <Group title="Result behaviour">
          <Segmented value={rules.feedbackMode || 'after_due'} options={[
            ['immediate', 'Show score + answers now'],
            ['after_due', 'Show after availability ends'],
            ['manual', 'Release manually'],
          ]} onChange={(v) => setRule('feedbackMode', v)} />
        </Group>
      </div>
    </Card>
  );
}

function AvailabilityPanel({ quiz, patch }) {
  const a = quiz.availability || {};
  return (
    <Card>
      <h3 className="h4 mb-4 text-heading">Availability window</h3>
      <p className="mb-4 text-sm text-body">Learners see the quiz only inside this window.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Opens</span>
          <input type="date" value={a.from || ''} onChange={(e) => patch({ availability: { ...a, from: e.target.value } })} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Closes</span>
          <input type="date" value={a.until || ''} onChange={(e) => patch({ availability: { ...a, until: e.target.value } })} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-lg bg-band/40 p-4 text-sm text-body">
        <Icon name="clock-alert" className="c-icon--sm fill-accent" />
        <span>
          {a.from && a.until
            ? `Open from ${a.from} until ${a.until}`
            : a.from
            ? `Opens on ${a.from} — no closing date set`
            : 'No availability window set — quiz is open as soon as it\'s live.'}
        </span>
      </div>
    </Card>
  );
}

function AntiCheatPanel({ quiz, patch }) {
  const ac = quiz.antiCheat || { trackFocus: true, maxFocusLosses: 3, fullscreen: false };
  function setAC(k, v) { patch({ antiCheat: { ...ac, [k]: v } }); }
  return (
    <Card>
      <h3 className="h4 mb-4 text-heading">Anti-cheat settings</h3>
      <ul className="flex flex-col gap-4">
        <ToggleRow checked={ac.trackFocus} onChange={(c) => setAC('trackFocus', c)} label="Track tab-switch / window-blur events" />
        <ToggleRow checked={ac.fullscreen} onChange={(c) => setAC('fullscreen', c)} label="Offer fullscreen mode (learner can opt in)" />
        <li className="rounded-lg bg-band/40 p-4">
          <p className="text-sm font-semibold text-heading">Auto-submit threshold</p>
          <p className="mt-1 text-xs text-body">After this many focus losses, the quiz auto-submits and the attempt is flagged for review.</p>
          <div className="mt-2 flex items-center gap-3">
            <input type="number" min="1" max="20" value={ac.maxFocusLosses ?? 3} onChange={(e) => setAC('maxFocusLosses', Number(e.target.value))} className="w-20 rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
            <span className="text-sm text-body">focus losses</span>
          </div>
        </li>
        <li className="rounded-lg border border-line p-4">
          <p className="text-sm font-semibold text-heading">Always on</p>
          <ul className="mt-2 list-inside list-disc text-sm text-body">
            <li>Questions and option order shuffled per attempt.</li>
            <li>Paste blocked inside essay answers.</li>
            <li>Right-click suppressed on quiz body.</li>
          </ul>
        </li>
      </ul>
    </Card>
  );
}

function ResultsPanel({ attempts }) {
  if (attempts.length === 0) {
    return (
      <Card>
        <div className="py-10 text-center">
          <Icon name="users" className="c-icon--md mx-auto fill-body/40" />
          <p className="h4 mt-3 text-heading">No attempts yet</p>
          <p className="mt-1 text-sm text-body">Once learners start taking this quiz, results will appear here.</p>
        </div>
      </Card>
    );
  }
  const submitted = attempts.filter((a) => a.status === 'submitted');
  return (
    <Card>
      <h3 className="h4 mb-4 text-heading">Attempts ({submitted.length})</h3>
      <div className="flex flex-col gap-3">
        {submitted.map((a) => {
          const max = Object.values(a.grading || {}).reduce((acc, g) => acc + (g.points || 0), 0);
          const pct = max ? Math.round((a.totalScore / max) * 100) : 0;
          const flagged = a.integrityFlags?.focusLosses > (a.integrityFlags?.maxFocusLosses || 99);
          return (
            <div key={a.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-band/30 p-3 text-sm">
              <span className="grid size-9 place-items-center rounded-full bg-accent font-heading text-xs text-white">
                {(a.userName || 'L').split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-heading">{a.userName || 'Learner'}</p>
                <p className="text-xs text-body/70">Attempt #{a.attemptNumber || 1} · {new Date(a.endedAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={pct >= (a.passingScore || 50) ? 'success' : 'warn'}>{a.totalScore}/{max} ({pct}%)</Badge>
                {flagged && <Badge tone="warn">Integrity ⚠</Badge>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ManualGradePanel({ quiz, attempts }) {
  const pending = attempts.filter((a) =>
    Object.values(a.grading || {}).some((g) => g.status === 'manual_pending' || g.status === 'manual_graded')
  );
  if (pending.length === 0) {
    return (
      <Card>
        <div className="py-10 text-center">
          <Icon name="clipboard-check" className="c-icon--md mx-auto fill-body/40" />
          <p className="h4 mt-3 text-heading">No essays to grade</p>
          <p className="mt-1 text-sm text-body">Add an essay question to your quiz to enable manual grading.</p>
        </div>
      </Card>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-body">{pending.length} essay {pending.length === 1 ? 'submission' : 'submissions'} awaiting review.</p>
      {pending.map((a) => {
        return Object.entries(a.grading).map(([qi, g]) =>
          g.status === 'manual_pending' || g.status === 'manual_graded' ? (
            <ManualGradeCard key={`${a.id}-${qi}`} attempt={a} questionIndex={Number(qi)} grading={g} />
          ) : null
        );
      })}
    </div>
  );
}

function ManualGradeCard({ attempt, questionIndex, grading }) {
  const [points, setPoints] = useState(grading.pointsEarned || 0);
  const [comment, setComment] = useState(grading.feedback || '');
  const [saved, setSaved] = useState(grading.status === 'manual_graded');
  const quiz = getQuiz(attempt.quizId);
  const qid = quiz?.questions?.[questionIndex];
  const item = qid ? getBankItem(qid) : null;

  function save() {
    recordEssayGrade(attempt.id, questionIndex, Number(points), comment);
    setSaved(true);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-heading">{attempt.userName || 'Learner'}</p>
          <p className="text-xs text-body/70">Question {questionIndex + 1} · submitted {new Date(attempt.endedAt).toLocaleString()}</p>
        </div>
        <Badge tone={saved ? 'success' : 'warn'}>{saved ? 'Graded' : 'Awaiting review'}</Badge>
      </div>
      {item && <p className="mt-3 rounded-md bg-band/60 p-3 text-sm text-heading">{item.prompt}</p>}
      <div className="mt-3 rounded-md bg-paper p-3 ring-1 ring-line">
        <p className="text-xs font-semibold uppercase tracking-wide text-body/70">Submission</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{attempt.answers?.[questionIndex]?.value || '—'}</p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block sm:col-span-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Points</span>
          <input type="number" min="0" max={grading.points} value={points} onChange={(e) => setPoints(Number(e.target.value))} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
          <span className="mt-1 block text-xs text-body/70">/ {grading.points}</span>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-body/70">Comment</span>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} className="w-full rounded-sm border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent" />
        </label>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button type="button" onClick={save} className="c-button c-button--primary !py-2">
          <Icon name="save" className="c-icon--sm" />
          Save grade
        </button>
      </div>
    </Card>
  );
}

function AnalyticsPanel({ quiz, analytics }) {
  const max = Math.max(...analytics.distribution, 1);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <h3 className="h4 mb-4 text-heading">Class performance</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field k="Attempts" v={analytics.attempts} />
          <Field k="Pass rate" v={`${analytics.passRate}%`} />
          <Field k="Median score" v={`${analytics.median}%`} />
          <Field k="Avg time" v={`${analytics.avgTime} min`} />
        </div>
      </Card>

      <Card>
        <h3 className="h4 mb-3 text-heading">Grade distribution</h3>
        <div className="flex flex-col gap-2">
          {[
            ['0–20', analytics.distribution[0]],
            ['21–40', analytics.distribution[1]],
            ['41–60', analytics.distribution[2]],
            ['61–80', analytics.distribution[3]],
            ['81–100', analytics.distribution[4]],
          ].map(([band, count], i) => (
            <div key={band} className="flex items-center gap-3 text-sm">
              <span className="w-16 shrink-0 text-body/80">{band}</span>
              <div className="h-6 flex-1 overflow-hidden rounded bg-line/40">
                <div
                  className={cn(
                    'h-full rounded transition-all',
                    i <= 1 ? 'bg-red-400' : i === 2 ? 'bg-amber-400' : 'bg-emerald-500'
                  )}
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-semibold tabular-nums">{count}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-body/70">
          <span className="size-3 rounded-sm bg-emerald-500" /> Pass band (≥{quiz.rules?.passingScore || 50}%)
          <span className="ml-3 size-3 rounded-sm bg-amber-400" /> Borderline
          <span className="ml-3 size-3 rounded-sm bg-red-400" /> Below pass
        </div>
      </Card>

      <Card>
        <h3 className="h4 mb-3 text-heading">Item analysis — flagging problem questions</h3>
        <p className="mb-3 text-sm text-body">Questions where learners struggle are flagged for revision.</p>
        <div className="flex flex-col gap-2">
          {analytics.itemAnalysis.map((row) => (
            <div
              key={row.questionId}
              className={cn(
                'flex items-center gap-3 rounded-lg p-3 text-sm',
                row.flag === 'review' ? 'bg-red-50 ring-1 ring-red-200' :
                row.flag === 'hard' ? 'bg-amber-50 ring-1 ring-amber-200' :
                'bg-band/30'
              )}
            >
              <span className="font-mono text-xs font-semibold text-accent">#{row.questionId}</span>
              <span className="flex-1 truncate text-heading">{row.prompt}</span>
              <div className="flex items-center gap-3">
                <span className="text-body/80">{Math.round(row.correctRate * 100)}% correct</span>
                <span className="text-body/80">{Math.round(row.avgTimeSec)}s avg</span>
                {row.flag === 'hard' && <Badge tone="warn">⚠ Hard</Badge>}
                {row.flag === 'review' && <Badge tone="warn">🚩 Review</Badge>}
                {!row.flag && <Badge tone="success">OK</Badge>}
              </div>
            </div>
          ))}
          {analytics.itemAnalysis.length === 0 && (
            <p className="text-sm text-body/70">No items to analyse yet.</p>
          )}
        </div>
        <div className="mt-3 rounded-lg bg-band/40 p-3 text-xs leading-relaxed text-body">
          <strong>Flag logic:</strong> <Badge tone="warn">⚠ Hard</Badge> = &lt; 50% correct ·{' '}
          <Badge tone="warn">🚩 Review</Badge> = &lt; 30% correct AND negative discrimination (top scorers got it wrong).
        </div>
      </Card>
    </div>
  );
}

/* ---------- shared bits ---------- */

function Field({ k, v }) {
  return (
    <div className="rounded-md bg-band/30 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-body/70">{k}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-heading">{v}</dd>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-body/70">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, suffix, suffix2 }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[#1d42a6]" />
      <span className="flex-1 font-medium text-heading">{label}</span>
      {suffix}
      {suffix2 && <span className="text-xs text-body/70">{suffix2}</span>}
    </label>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'rounded-sm px-3 py-1.5 text-xs font-semibold transition-colors',
            value === id ? 'bg-accent text-white shadow-sm' : 'text-body hover:text-heading'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}