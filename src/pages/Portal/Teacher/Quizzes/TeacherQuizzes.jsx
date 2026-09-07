import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge, SearchInput, Stat } from '../../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../../components/ui/Kit.jsx';
import { listQuizzes, getBankItem, listAttempts } from '../../../../data/quizzes.js';
import { learningCourses, getLearningCourse } from '../../../../data/learning.js';
import { getPortalUser } from '../../../../lib/portalAuth.js';
import cn from '../../../../lib/cn.js';

export default function TeacherQuizzes() {
  const user = getPortalUser();
  const myQuizzes = listQuizzes(user.id);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return myQuizzes.filter((quiz) => {
      if (status !== 'all' && quiz.status !== status) return false;
      if (q && !`${quiz.title} ${quiz.description || ''}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [myQuizzes, q, status]);

  const totalAttempts = myQuizzes.reduce((acc, qz) => acc + listAttempts(qz.id).length, 0);
  const pendingGrading = myQuizzes.reduce(
    (acc, qz) => acc + listAttempts(qz.id).filter((a) =>
      Object.values(a.grading || {}).some((g) => g.status === 'manual_pending')
    ).length,
    0
  );
  const questionsBank = myQuizzes.reduce((acc, qz) => acc + qz.questions.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Quizzes"
        subtitle="All quizzes you've authored on the platform."
        actions={
          <Link to="/portal/teacher/quizzes/new" className="c-button c-button--primary !py-2.5">
            <Icon name="plus" className="c-icon--sm" />
            New quiz
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Quizzes" value={myQuizzes.length} sub="Live + drafts" icon={<Icon name="check-square" className="c-icon--sm" />} />
        <Stat label="Total attempts" value={totalAttempts} sub="Across all quizzes" icon={<Icon name="users" className="c-icon--sm" />} />
        <Stat label="Pending grading" value={pendingGrading} sub="Essays awaiting review" icon={<Icon name="clipboard-check" className="c-icon--sm" />} />
        <Stat label="Questions" value={questionsBank} sub="In this term's quizzes" icon={<Icon name="help-circle" className="c-icon--sm" />} />
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={q} onChange={setQ} placeholder="Search quizzes…" />
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
            {[
              ['all', 'All'],
              ['live', 'Live'],
              ['scheduled', 'Scheduled'],
              ['draft', 'Draft'],
              ['closed', 'Closed'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStatus(id)}
                className={
                  'rounded-sm px-3 py-1.5 text-sm font-semibold capitalize transition-colors ' +
                  (status === id ? 'bg-accent text-white' : 'text-body hover:text-heading')
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Icon name="check-square" className="c-icon--md mx-auto fill-body/40" />
            <p className="h4 mt-3 text-heading">No quizzes yet</p>
            <p className="mt-1 text-sm text-body">Create your first quiz to assess learners.</p>
            <Link to="/portal/teacher/quizzes/new" className="mt-4 inline-flex c-button c-button--primary !py-2.5">
              <Icon name="plus" className="c-icon--sm" />
              New quiz
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((quiz) => {
            const attempts = listAttempts(quiz.id);
            const course = learningCourses.find((c) => c.slug === quiz.courseId);
            const pending = attempts.filter((a) => Object.values(a.grading || {}).some((g) => g.status === 'manual_pending')).length;
            return (
              <Card key={quiz.id} className="group">
                <div className="flex flex-wrap items-start gap-4">
                  <span className={cn(
                    'grid size-12 shrink-0 place-items-center rounded-lg',
                    quiz.status === 'live' ? 'bg-cyan/15 text-cyan-deep' :
                    quiz.status === 'draft' ? 'bg-band text-body' :
                    quiz.status === 'scheduled' ? 'bg-pill/20 text-pill-ink' :
                    'bg-slate-100 text-slate-500'
                  )}>
                    <Icon name="check-square" className="c-icon--md" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={quiz.status === 'live' ? 'success' : quiz.status === 'draft' ? 'muted' : 'warn'}>
                        {quiz.status}
                      </Badge>
                      {course && <Badge tone="cyan">{course.subject}</Badge>}
                      <Badge tone="muted">{quiz.type}</Badge>
                    </div>
                    <Link
                      to={`/portal/teacher/quizzes/${quiz.id}`}
                      className="mt-1 block text-base font-semibold text-heading hover:text-accent"
                    >
                      {quiz.title}
                    </Link>
                    {quiz.description && <p className="mt-0.5 text-sm text-body/80">{quiz.description}</p>}
                    <p className="mt-2 text-xs text-body/70">
                      {quiz.questions.length} questions · {quiz.rules?.timeLimitMin ? `${quiz.rules.timeLimitMin} min · ` : ''}{quiz.rules?.attempts ? `${quiz.rules.attempts} attempts · ` : ''}Pass {quiz.rules?.passingScore}%
                      {quiz.availability?.until && ` · until ${quiz.availability.until}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="text-sm font-semibold text-heading">{attempts.length} <span className="text-xs font-normal text-body">attempts</span></p>
                    {pending > 0 && (
                      <Badge tone="warn">{pending} awaiting review</Badge>
                    )}
                    <Link
                      to={`/portal/teacher/quizzes/${quiz.id}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      Open →
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}