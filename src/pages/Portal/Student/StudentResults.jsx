import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card } from '../../../components/portal/PortalKit.jsx';
import { ResultsTable, GradePill } from '../../../components/portal/PortalBits.jsx';
import { students, studentResults, averageScore, classPosition, school } from '../../../data/school.js';

const LEGEND = ['A', 'B', 'C', 'D', 'F'];

export default function StudentResults() {
  const user = getPortalUser();
  const me = students.find((s) => s.id === user.id) || students[3];
  const results = studentResults(me.id, me.class);
  const avg = averageScore(me.id, me.class);
  const pos = classPosition(me.id, me.class);
  const roster = students.filter((s) => s.class === me.class).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My results"
        subtitle={`${me.name} · ${me.class} · ${school.academicYear} ${school.term}`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-body">Term average</p>
          <p className="mt-1 font-heading text-3xl text-accent">{avg}%</p>
          <div className="mt-2"><GradePill letter={avg >= 75 ? 'A' : avg >= 65 ? 'B' : avg >= 55 ? 'C' : avg >= 45 ? 'D' : 'F'} /></div>
        </Card>
        <Card>
          <p className="text-sm text-body">Class position</p>
          <p className="mt-1 font-heading text-3xl text-heading">{pos} of {roster}</p>
        </Card>
        <Card>
          <p className="text-sm text-body">Subjects graded</p>
          <p className="mt-1 font-heading text-3xl text-heading">{results.length}</p>
        </Card>
      </div>

      <ResultsTable results={results} />

      <Card>
        <h3 className="h4 mb-3 text-heading">Grading scale</h3>
        <div className="flex flex-wrap gap-2">
          {LEGEND.map((l) => (
            <span key={l} className="inline-flex items-center gap-2 text-sm text-body">
              <GradePill letter={l} />
              {l === 'A' ? '75–100%' : l === 'B' ? '65–74%' : l === 'C' ? '55–64%' : l === 'D' ? '45–54%' : 'Below 45%'}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}