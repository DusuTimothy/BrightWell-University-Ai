import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { students, scoreFor, gradeFor } from '../../../data/school.js';

export default function TeacherClasses() {
  const myClasses = ['SS1', 'SS2', 'SS3'];

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="My classes" subtitle="Rosters and current term position in Mathematics" />

      {myClasses.map((cls) => {
        const roster = students.filter((s) => s.class === cls);
        const pass = roster.filter((s) => gradeFor(scoreFor(s.id, 'Mathematics')).letter !== 'F').length;
        return (
          <Card key={cls}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="h4 text-heading">{cls} — Mathematics</h3>
                <p className="text-sm text-body">{roster.length} students on roll · {pass} at pass grade</p>
              </div>
              <Link to="/portal/teacher/gradebook" className="text-sm font-semibold text-accent hover:underline">
                Open gradebook →
              </Link>
            </div>

            {roster.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {roster.map((s) => {
                  const score = scoreFor(s.id, 'Mathematics');
                  const g = gradeFor(score);
                  return (
                    <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg bg-off-white-50 px-3 py-2.5 text-sm ring-1 ring-line/60">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{s.name}</p>
                        <p className="truncate text-xs text-body/70">{s.admNo}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="font-semibold text-heading">{score}%</span>
                        <GradePill letter={g.letter} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="rounded-lg bg-slate-50 px-4 py-6 text-sm text-body/70 ring-1 ring-line">No demo students in {cls} for this subject.</p>
            )}
            {roster.length > 0 && (
              <p className="mt-3 text-xs text-body/70">
                <Badge tone="success">{pass}/{roster.length}</Badge>&nbsp; students are at or above a pass grade.
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}