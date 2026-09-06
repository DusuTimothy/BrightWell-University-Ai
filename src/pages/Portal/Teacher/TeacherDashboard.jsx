import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { Icon } from '../../../components/ui/Kit.jsx';
import { PageHeading, Card, Stat, Badge } from '../../../components/portal/PortalKit.jsx';
import { students, staff, timetableFor, scoreFor, gradeFor, todayDay, announcements, school } from '../../../data/school.js';

export default function TeacherDashboard() {
  const user = getPortalUser();
  const me = staff.find((t) => t.id === user.id) || staff[0];
  const classesTaught = ['SS1', 'SS2'];
  const myStudents = students.filter((s) => classesTaught.includes(s.class));
  const scores = myStudents.map((s) => scoreFor(s.id, me.subject));
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  const timetable = timetableFor('SS1');
  const today = todayDay();
  const todays = timetable.find((d) => d.day === today);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Good day, ${me.name.split(' ')[2] || me.name}`}
        subtitle={`${me.subject} Teacher · ${me.id} · ${school.academicYear} ${school.term}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Classes" value={classesTaught.length} sub="SS1 & SS2" icon={<Icon name="building" className="c-icon--sm" />} />
        <Stat label="My students" value={myStudents.length} sub="Across my two classes" icon={<Icon name="users" className="c-icon--sm" />} />
        <Stat label="Lessons / week" value={timetable.flatMap((d) => d.blocks).filter((b) => !b.break && b.subject === me.subject).length} sub="Morning slots" icon={<Icon name="calendar-clock" className="c-icon--sm" />} />
        <Stat label="Class average" value={`${avg}%`} sub={`Grade ${gradeFor(avg).letter} trend`} icon={<Icon name="award" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="h4 mb-1 text-heading">Today — {today}</h3>
          <p className="mb-3 text-sm text-body">Your {me.subject} lessons this morning.</p>
          {todays ? (
            <ol className="flex flex-col divide-y divide-line/70 text-sm">
              {todays.blocks
                .filter((b) => !b.break && b.subject === me.subject)
                .map((b) => (
                  <li key={b.block} className="flex items-center justify-between py-2.5">
                    <span className="text-body">{b.block}</span>
                    <Badge tone="cyan">{b.subject} · SS1</Badge>
                  </li>
                ))}
              {!todays.blocks.some((b) => b.subject === me.subject) && (
                <li className="py-2.5 text-body/70">No {me.subject} lesson on {today}.</li>
              )}
            </ol>
          ) : (
            <p className="text-sm text-body">No lessons scheduled — enjoy your weekend.</p>
          )}
        </Card>

        <Card>
          <h3 className="h4 mb-4 text-heading">Staff notices</h3>
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
            {announcements.filter((a) => a.audience === 'All' || a.audience === 'Staff').map((a) => (
              <div key={a.id} className="rounded-lg bg-off-white-50 p-3">
                <div className="flex items-center gap-2">
                  <Badge tone="warn">{a.audience}</Badge>
                  <span className="text-xs text-body/70">{a.date}</span>
                </div>
                <p className="mt-1 font-medium text-ink">{a.title}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}