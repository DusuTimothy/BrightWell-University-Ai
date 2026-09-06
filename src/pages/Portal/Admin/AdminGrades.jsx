import React, { useState } from 'react';
import { PageHeading, Badge, DataTable } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { classes, students, studentResults, averageScore, classPosition } from '../../../data/school.js';
import cn from '../../../lib/cn.js';

export default function AdminGrades() {
  const [selected, setSelected] = useState('SS1');
  const roster = students.filter((s) => s.class === selected);
  const subjects = roster.length ? studentResults(roster[0].id, selected).map((r) => r.subject) : [];

  const rows = roster.map((s) => {
    const results = studentResults(s.id, selected);
    const avg = averageScore(s.id, selected);
    const pos = classPosition(s.id, selected);
    const cells = [
      <span key="adm" className="font-mono text-xs text-accent">{s.admNo}</span>,
      <span key="name" className="font-medium text-ink">{s.name}</span>,
    ];
    subjects.forEach((sub) => {
      const r = results.find((x) => x.subject === sub);
      cells.push(
        <span key={sub} className="inline-flex items-center gap-1.5">
          {r.score}
          <GradePill letter={r.letter} />
        </span>
      );
    });
    cells.push(
      <span key="avg" className="font-bold text-heading">{avg}%</span>,
      <Badge key="pos" tone={pos <= 3 ? 'success' : 'muted'}>{pos} of {roster.length}</Badge>
    );
    return cells;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Term grades"
        subtitle="First-term scores per subject, with class position"
        actions={
          <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  selected === c.id ? 'bg-accent text-white' : 'text-body hover:text-heading'
                )}
              >
                {c.id}
              </button>
            ))}
          </div>
        }
      />

      <DataTable head={['Adm No', 'Student', ...subjects, 'Overall', 'Position']} rows={rows} />
    </div>
  );
}