import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Card, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getQuiz, getBankItem, saveAttempt, listAttemptsByUser } from '../../../data/quizzes.js';
import { gradeAttempt, shuffleAttempt } from '../../../data/quizEngine.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import cn from '../../../lib/cn.js';

export default function QuizRunner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getPortalUser();
  const quiz = getQuiz(id);

  if (!quiz) return <Navigate to="/portal/student/courses" replace />;

  // Attempt seed for shuffling
  const attemptId = useMemo(() => `ATT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, []);
  const order = useMemo(() => shuffleAttempt(quiz, attemptId.charCodeAt(4) || 1), [quiz.id]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIdx: { value | index, timeMs } }
  const [focusLosses, setFocusLosses] = useState(0);
  const [pasteBlocks, setPasteBlocks] = useState(0);
  const [startedAt] = useState(Date.now());
  const [submitted, setSubmitted] = useState(false);
  const [graded, setGraded] = useState(null);
  const [warningVisible, setWarningVisible] = useState(false);
  const qStartRef = useRef(Date.now());

  // Anti-cheat: focus & paste listeners
  useEffect(() => {
    if (submitted) return;
    const onBlur = () => {
      setFocusLosses((n) => {
        const next = n + 1;
        if (next === 1) setWarningVisible(true);
        return next;
      });
    };
    const onPaste = (e) => {
      if (e.target?.tagName === 'TEXTAREA') {
        e.preventDefault();
        setPasteBlocks((n) => n + 1);
        setWarningVisible(true);
      }
    };
    window.addEventListener('blur', onBlur);
    document.addEventListener('paste', onPaste, true);
    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('paste', onPaste, true);
    };
  }, [submitted]);

  // Auto-submit when focus losses exceed threshold
  useEffect(() => {
    if (focusLosses >= (quiz.antiCheat?.maxFocusLosses || 99) && !submitted) {
      handleSubmit(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLosses]);

  // Time bank
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (quiz.availability?.from && new Date(quiz.availability.from) > new Date()) {
    return <Locked message={`This quiz opens on ${quiz.availability.from}.`} />;
  }
  if (quiz.availability?.until && new Date(quiz.availability.until) < new Date()) {
    return <Locked message={`This quiz closed on ${quiz.availability.until}.`} />;
  }

  // Attempt limit
  const pastAttempts = listAttemptsByUser(user.id).filter((a) => a.quizId === quiz.id);
  if (quiz.rules?.attempts && pastAttempts.length >= quiz.rules.attempts) {
    return (
      <Locked
        message={`You've used all ${quiz.rules.attempts} attempts for this quiz.`}
        action={<Link to="/portal/student/quizzes" className="c-button c-button--primary !py-2.5">View history</Link>}
      />
    );
  }

  const totalQ = quiz.questions.length;
  const realIdx = order.questionOrder[currentIdx];
  const qid = quiz.questions[realIdx];
  const item = getBankItem(qid);
  const elapsedMin = Math.floor((now - startedAt) / 60000);
  const elapsedSec = Math.floor(((now - startedAt) % 60000) / 1000);
  const timeLeft = quiz.rules?.timeLimitMin ? Math.max(0, quiz.rules.timeLimitMin * 60 - Math.floor((now - startedAt) / 1000)) : null;

  // Auto-submit on time up
  useEffect(() => {
    if (timeLeft === 0 && !submitted) handleSubmit(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function recordAnswer(qIdx, value) {
    const ms = Date.now() - qStartRef.current;
    setAnswers((a) => ({
      ...a,
      [qIdx]: { ...(a[qIdx] || {}), value, timeMs: ((a[qIdx]?.timeMs) || 0) + ms },
    }));
  }

  function next() {
    qStartRef.current = Date.now();
    if (currentIdx < totalQ - 1) setCurrentIdx(currentIdx + 1);
  }
  function prev() {
    qStartRef.current = Date.now();
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  }

  function handleSubmit(autoSubmit = false) {
    if (submitted) return;
    const result = gradeAttempt(quiz, answers);
    const integrityFlags = { focusLosses, pasteBlocks, maxFocusLosses: quiz.antiCheat?.maxFocusLosses || 99, autoSubmitted: autoSubmit };
    const attempt = {
      id: attemptId,
      quizId: quiz.id,
      userId: user.id,
      userName: user.name,
      startedAt,
      endedAt: Date.now(),
      attemptNumber: pastAttempts.length + 1,
      answers,
      grading: result.grading,
      totalScore: result.total,
      maxScore: result.maxScore,
      passed: result.passed,
      integrityFlags,
      status: 'submitted',
    };
    saveAttempt(attempt);
    setGraded(result);
    setSubmitted(true);
  }

  if (submitted && graded) {
    return <ResultsScreen quiz={quiz} attempt={{ ...graded, integrityFlags: { focusLosses, pasteBlocks }, passed: graded.passed, totalScore: graded.total }} user={user} navigate={navigate} />;
  }

  if (!item) {
    return (
      <Card>
        <p className="text-sm text-body">Question not found.</p>
      </Card>
    );
  }

  const answeredHere = answers[realIdx]?.value != null;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/portal/student/courses" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        Back to courses
      </Link>

      {/* Top bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">{quiz.title}</p>
            <p className="text-sm text-body">{quiz.description}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {timeLeft != null && (
              <span className={cn('flex items-center gap-1 rounded-sm px-2.5 py-1.5 font-mono text-sm font-bold', timeLeft < 60 ? 'bg-red-50 text-red-700' : 'bg-band text-heading')}>
                <Icon name="clock" className="c-icon--xs" />
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            )}
            <button type="button" onClick={() => handleSubmit()} className="c-button c-button--primary !py-2">
              Submit quiz
            </button>
          </div>
        </div>
        <div className="mt-3">
          <Bar pct={((currentIdx + (answeredHere ? 1 : 0)) / totalQ) * 100} />
          <p className="mt-1 text-xs text-body/70">Question {currentIdx + 1} of {totalQ}</p>
        </div>
      </Card>

      {/* Anti-cheat warning */}
      {warningVisible && (
        <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <Icon name="alert-triangle" className="c-icon--sm shrink-0 fill-amber-600" />
          <div className="flex-1">
            <p className="font-semibold">Stay in this tab</p>
            <p className="mt-0.5 text-xs">
              Focus losses are being counted. After {quiz.antiCheat?.maxFocusLosses || 3}, your attempt auto-submits.
              {pasteBlocks > 0 && ` Pasted blocks: ${pasteBlocks}.`}
            </p>
          </div>
          <button type="button" onClick={() => setWarningVisible(false)} aria-label="Dismiss" className="grid size-7 place-items-center rounded-md hover:bg-amber-100">
            <Icon name="cross" className="c-icon--sm" />
          </button>
        </div>
      )}

      {/* Question */}
      <Card>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
          Question {currentIdx + 1} of {totalQ}
          <Badge tone="muted">{item.points} pt{item.points !== 1 ? 's' : ''}</Badge>
        </p>
        <p className="mt-2 text-lg font-medium text-heading">{item.prompt}</p>

        <div className="mt-6">
          {item.type === 'mcq-single' && (
            <MCQSingle item={item} value={answers[realIdx]?.value} onChange={(v) => recordAnswer(realIdx, v)} order={order.optionOrders[realIdx] || item.options.map((_, i) => i)} />
          )}
          {item.type === 'tf' && (
            <TrueFalse item={item} value={answers[realIdx]?.value} onChange={(v) => recordAnswer(realIdx, v)} />
          )}
          {item.type === 'short' && (
            <ShortAnswer item={item} value={answers[realIdx]?.value} onChange={(v) => recordAnswer(realIdx, v)} />
          )}
          {item.type === 'essay' && (
            <Essay item={item} value={answers[realIdx]?.value} onChange={(v) => recordAnswer(realIdx, v)} />
          )}
        </div>
      </Card>

      {/* Nav */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={prev} disabled={currentIdx === 0} className="c-button c-button--secondary !py-2.5 disabled:opacity-40">
          <Icon name="chevron-left" className="c-icon--sm" />
          Previous
        </button>
        {currentIdx < totalQ - 1 ? (
          <button type="button" onClick={next} className="c-button c-button--primary !py-2.5">
            Next
            <Icon name="chevron-right" className="c-icon--sm" />
          </button>
        ) : (
          <button type="button" onClick={() => handleSubmit()} className="c-button c-button--primary !py-2.5">
            Submit quiz
            <Icon name="check-circle" className="c-icon--sm" />
          </button>
        )}
      </div>
    </div>
  );
}

function MCQSingle({ item, value, onChange, order }) {
  return (
    <ul className="flex flex-col gap-2">
      {order.map((origIdx, i) => {
        const opt = item.options[origIdx];
        const selected = value === origIdx;
        return (
          <li key={origIdx}>
            <button
              type="button"
              onClick={() => onChange(origIdx)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-colors',
                selected ? 'border-accent bg-accent/10 font-semibold text-accent' : 'border-line bg-paper text-body hover:border-accent/60'
              )}
            >
              <span className={cn(
                'grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold',
                selected ? 'bg-accent text-white' : 'bg-band text-body'
              )}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {selected && <Icon name="check-circle" className="c-icon--sm fill-accent" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function TrueFalse({ item, value, onChange }) {
  return (
    <div className="flex gap-2">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            'flex-1 rounded-lg border-2 p-4 text-base font-semibold transition-colors',
            value === v ? 'border-accent bg-accent/10 text-accent' : 'border-line bg-paper text-body hover:border-accent/60'
          )}
        >
          {v ? 'True' : 'False'}
        </button>
      ))}
    </div>
  );
}

function ShortAnswer({ value, onChange }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer…"
      className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
    />
  );
}

function Essay({ value, onChange, item }) {
  return (
    <div>
      <textarea
        rows={6}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onPaste={(e) => e.preventDefault()}
        placeholder="Write your response here. Pasting is disabled to keep this your own work."
        className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
      />
      {item.wordLimit && (
        <p className="mt-1 text-xs text-body/70">Up to {item.wordLimit} words.</p>
      )}
    </div>
  );
}

function ResultsScreen({ quiz, attempt, user, navigate }) {
  const pct = attempt.maxScore ? Math.round((attempt.totalScore / attempt.maxScore) * 100) : 0;
  const passed = pct >= (quiz.rules?.passingScore || 50);
  const showAnswers = quiz.rules?.feedbackMode === 'immediate' ||
    (quiz.rules?.feedbackMode === 'after_due' && (!quiz.availability?.until || new Date(quiz.availability.until) < new Date()));

  return (
    <div className="flex flex-col gap-6">
      <Card className="text-center">
        <div className={cn('mx-auto grid size-16 place-items-center rounded-full', passed ? 'bg-emerald-50' : 'bg-amber-50')}>
          <Icon name={passed ? 'check-circle' : 'alert-triangle'} className={cn('c-icon--md', passed ? 'fill-emerald-600' : 'fill-amber-600')} />
        </div>
        <h2 className="h2 mt-4 text-heading">{passed ? 'You passed!' : 'Submitted'}</h2>
        <p className="mt-1 text-body">
          You scored <strong className="text-accent">{attempt.totalScore}/{attempt.maxScore}</strong> ({pct}%)
        </p>
        <p className="mt-1 text-sm text-body/70">
          {showAnswers
            ? 'Your answers are shown below.'
            : 'Detailed feedback will unlock when the quiz closes.'}
        </p>

        {attempt.integrityFlags?.focusLosses > 0 && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
            <Icon name="alert-triangle" className="c-icon--xs fill-amber-600" />
            {attempt.integrityFlags.focusLosses} focus losses logged
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => navigate('/portal/student/quizzes')} className="c-button c-button--primary !py-2.5">
            View quiz history
          </button>
          <Link to="/portal/student/courses" className="c-button c-button--secondary !py-2.5">
            Back to courses
          </Link>
        </div>
      </Card>

      {showAnswers && (
        <Card>
          <h3 className="h4 mb-3 text-heading">Review your answers</h3>
          <ol className="flex flex-col gap-3">
            {quiz.questions.map((qid, qi) => {
              const item = getBankItem(qid);
              const g = attempt.grading?.[qi] || { status: 'pending' };
              return (
                <li key={qi} className="rounded-lg bg-band/30 p-3 text-sm">
                  <p className="font-medium text-heading">{qi + 1}. {item?.prompt}</p>
                  <p className="mt-1 text-xs">
                    {g.status === 'manual_pending' && <Badge tone="warn">Awaiting manual grading</Badge>}
                    {g.status === 'manual_graded' && (
                      <span>
                        <Badge tone="success">{g.pointsEarned}/{g.points} pts</Badge>
                        {g.feedback && <span className="ml-2 text-body/80">"{g.feedback}"</span>}
                      </span>
                    )}
                    {g.status === 'auto' && (
                      <Badge tone={g.correct ? 'success' : 'warn'}>{g.pointsEarned}/{g.points} pts · {g.correct ? 'Correct' : 'Incorrect'}</Badge>
                    )}
                  </p>
                </li>
              );
            })}
          </ol>
        </Card>
      )}
    </div>
  );
}

function Locked({ message, action }) {
  return (
    <Card>
      <div className="flex items-start gap-3 py-6 text-center">
        <div className="mx-auto">
          <Icon name="clock-alert" className="c-icon--md mx-auto fill-body/40" />
          <p className="h4 mt-3 text-heading">Quiz unavailable</p>
          <p className="mt-1 text-sm text-body">{message}</p>
          {action || <Link to="/portal/student/courses" className="mt-4 inline-flex c-button c-button--primary !py-2.5">Back to courses</Link>}
        </div>
      </div>
    </Card>
  );
}