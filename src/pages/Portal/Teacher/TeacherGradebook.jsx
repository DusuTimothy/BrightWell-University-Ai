import React, { useState } from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Badge, Card } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { staff, students, gradeFor, school } from '../../../data/school.js';
import cn from '../../../lib/cn.js';

export default function TeacherGradebook() {
  const user = getPortalUser();
  const me = staff.find((t) => t.id === user.id) || staff[0];
  const classes = ['SS1', 'SS2'];
  const [selected, setSelected] = useState('SS1');
  const [scores, setScores] = useState({});
  const roster = students.filter((s) => s.class === selected);

  function setScore(id, val) {
    const n = Math.max(0, Math.min(100, Number(val) || 0));
    setScores((p) => ({ ...p, [id]: n }));
  }

  const avgVal = roster.length
    ? Math.round(roster.reduce((a, s) => a + scores[s.id], 0) / roster.length)
    : 0;
  const saved = scores[Object.keys(scores)[0]] != null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Gradebook — ${me.subject}`}
        subtitle={`Enter or adjust ${me.subject} scores for the ${school.term} term`}
        actions={
          <div className="flex gap-1 rounded-lg bg-off-white-50 p-1">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => setSelected(c)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  selected === c ? 'bg-accent text-white' : 'text-body hover:text-heading'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        }
      />

      <div className="overflow-x-auto rounded-xl ring-1 ring-line">
        <table className="w-full min-w-[640px] border-collapse bg-paper text-sm">
          <thead>
            <tr className="bg-band/70 text-left">
              <th className="px-4 py-3 font-semibold text-royal">Student</th>
              <th className="px-4 py-3 font-semibold text-royal">Admission</th>
              <th className="px-4 py-3 font-semibold text-royal">{me.subject} score (0–100)</th>
              <th className="px-4 py-3 font-semibold text-royal">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {roster.map((s) => {
              const score = scores[s.id];
              const g = gradeFor(score == null ? 50 : score);
              return (
                <tr key={s.id} className="hover:bg-band/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{s.name}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">{s.admNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score == null ? '' : score}
                        placeholder={String(50)}
                        onChange={(e) => setScore(s.id, e.target.value)}
                        className="w-24 rounded-md border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-accent"
                      />
                      {score == null && (
                        <span className="text-xs text-body/70">demo {50}%</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <GradePill letter={g.letter} />
                  </td>
                </tr>
              );
            })}
            {roster.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-body/70">No students in this class.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {roster.length > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-body">
            <Badge tone="accent">{selected} · {me.subject}</Badge>
            <span>
              Recorded average: <strong className="text-heading">{avgVal}%</strong>
            </span>
          </div>
          {saved ? (
            <span className="text-sm font-medium text-emerald-600">Scores saved in this session.</span>
          ) : (
            <span className="text-sm text-body/70">Edit any score above — grades and the average update instantly.</span>
          )}
        </Card>
      )}
    </div>
  );
}