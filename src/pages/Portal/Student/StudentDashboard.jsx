import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Stat, Badge } from '../../../components/portal/PortalKit.jsx';
import { AnnouncementsList, fmtNaira } from '../../../components/portal/PortalBits.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { students, averageScore, classPosition, studentResults, feesFor, timetableFor, todayDay, announcements, school, gradeFor } from '../../../data/school.js';

export default function StudentDashboard() {
  const user = getPortalUser();
  const me = students.find((s) => s.id === user.id) || students[3];
  const results = studentResults(me.id, me.class);
  const avg = averageScore(me.id, me.class);
  const pos = classPosition(me.id, me.class);
  const rosterSize = students.filter((s) => s.class === me.class).length;
  const fee = feesFor(me.id);
  const timetable = timetableFor(me.class);
  const today = todayDay();
  const todays = timetable.find((d) => d.day === today);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Hello, ${me.name.split(' ')[0]}`}
        subtitle={`${me.class} · ${school.academicYear} · ${school.term}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Term average" value={`${avg}%`} sub={`Grade ${gradeFor(avg).letter}`} icon={<Icon name="award" className="c-icon--sm" />} />
        <Stat label="Class position" value={`${pos} of ${rosterSize}`} sub={rosterSize > 0 && pos <= Math.ceil(rosterSize / 3) ? 'Top group' : 'Keep going!'} icon={<Icon name="users" className="c-icon--sm" />} />
        <Stat label="Subjects" value={results.length} sub="Recorded this term" icon={<Icon name="graduation-cap" className="c-icon--sm" />} />
        <Stat label="Fee balance" value={fmtNaira(fee.balance)} sub={fee.balance === 0 ? 'Paid in full' : `${Math.round((fee.paid / fee.fee) * 100)}% paid`} icon={<Icon name="naira" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="h4 text-heading">Today — {today}</h3>
            <Badge tone="cyan">Week plan</Badge>
          </div>
          {todays ? (
            <ol className="flex flex-col divide-y divide-line/70 text-sm">
              {todays.blocks.filter((b) => !b.break).map((b) => (
                <li key={b.block + b.subject} className="flex items-center justify-between gap-3 py-2.5">
                  <span className="text-body">{b.block}</span>
                  <span className="font-semibold text-ink">
                    {b.subject}
                    <span className="ml-2 text-xs font-normal text-body/70">{b.teacher}</span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-body">No lessons scheduled today — enjoy your weekend.</p>
          )}
        </Card>

        <Card>
          <h3 className="h4 mb-4 text-heading">Latest news</h3>
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-lg bg-off-white-50 p-3">
                <div className="flex items-center gap-2">
                  <Badge tone={a.audience === 'All' ? 'accent' : 'success'}>{a.audience}</Badge>
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