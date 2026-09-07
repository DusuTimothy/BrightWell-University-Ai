import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { listAttemptsByUser } from '../../../data/quizzes.js';
import { getQuiz } from '../../../data/quizzes.js';
import { getPortalUser } from '../../../lib/portalAuth.js';

export default function StudentQuizHistory() {
  const user = getPortalUser();
  const attempts = listAttemptsByUser(user.id);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Quiz history" subtitle="Every attempt you've made, with score and integrity flags." />

      {attempts.length === 0 ? (
        <Card>
          <div className="py-10 text-center">
            <Icon name="history" className="c-icon--md mx-auto fill-body/40" />
            <p className="h4 mt-3 text-heading">No quiz attempts yet</p>
            <p className="mt-1 text-sm text-body">Take your first quiz from any enrolled course.</p>
            <Link to="/portal/student/courses" className="mt-4 inline-flex c-button c-button--primary !py-2.5">
              View my courses
              <Icon name="arrow" className="c-icon--sm" />
            </Link>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {attempts.map((a) => {
            const quiz = getQuiz(a.quizId);
            const max = Object.values(a.grading || {}).reduce((acc, g) => acc + (g.points || 0), 0);
            const pct = max ? Math.round((a.totalScore / max) * 100) : 0;
            const passed = pct >= (quiz?.rules?.passingScore || 50);
            const flagged = a.integrityFlags?.focusLosses > 0;
            return (
              <Card key={a.id} className="flex flex-wrap items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Icon name="check-square" className="c-icon--md" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-heading">{quiz?.title || a.quizId}</p>
                  <p className="text-xs text-body/70">
                    Attempt #{a.attemptNumber || 1} · {new Date(a.endedAt).toLocaleString()} · {Math.round((a.endedAt - a.startedAt) / 60000)} min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {flagged && <Badge tone="warn">⚠ {a.integrityFlags.focusLosses} focus losses</Badge>}
                  <Badge tone={passed ? 'success' : 'warn'}>
                    {a.totalScore}/{max} ({pct}%) · {passed ? 'Passed' : 'Retake'}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}