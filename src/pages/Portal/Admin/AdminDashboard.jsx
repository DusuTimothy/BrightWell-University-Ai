import React from 'react';
import { Icon } from '../../../components/ui/Kit.jsx';
import { PageHeading, Card, Stat, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { fmtNaira } from '../../../components/portal/PortalBits.jsx';
import { classes, staff, students, feesFor, averageScore, announcements, attendanceFor, school } from '../../../data/school.js';

export default function AdminDashboard() {
  const totalStudents = classes.reduce((a, c) => a + c.students, 0);
  const collected = students.reduce((a, s) => a + feesFor(s.id).paid, 0);
  const expected = students.reduce((a, s) => a + feesFor(s.id).fee, 0);

  const top = [...students]
    .map((s) => ({ ...s, avg: averageScore(s.id, s.class) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  const maxClass = Math.max(...classes.map((c) => c.students));
  const att = attendanceFor('SS1');
  const attAvg = Math.round(att.reduce((a, d) => a + (d.present / d.enrolled) * 100, 0) / att.length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Welcome back, ${school.short}`}
        subtitle={`${school.academicYear} · ${school.term} · Monday, 8 September 2025`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Students on roll" value={totalStudents} sub="6 classes · JSS1 – SS3" icon={<Icon name="users" className="c-icon--sm" />} />
        <Stat label="Teaching staff" value={staff.length} sub="8 subject teachers" icon={<Icon name="badge" className="c-icon--sm" />} />
        <Stat label="Classes" value={classes.length} sub={`${school.term.toLowerCase()} running`} icon={<Icon name="building" className="c-icon--sm" />} />
        <Stat label="Fees collected" value={fmtNaira(collected)} sub={`${Math.round((collected / expected) * 100)}% of ${fmtNaira(expected)}`} icon={<Icon name="naira" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="h4 mb-4 text-heading">Class sizes</h3>
          <div className="flex flex-col gap-3">
            {classes.map((c) => (
              <div key={c.id} className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-3 text-sm">
                <span className="font-semibold text-accent">{c.id}</span>
                <Bar pct={(c.students / maxClass) * 100} />
                <span className="text-right text-body">{c.students}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="h4 mb-4 text-heading">Attendance — SS1 this week</h3>
          <div className="flex flex-col gap-3">
            {att.map((d) => (
              <div key={d.day} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3 text-sm">
                <span className="font-semibold text-heading">{d.day}</span>
                <Bar pct={(d.present / d.enrolled) * 100} />
                <span className="text-body">{d.present}/{d.enrolled}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-band/50 px-3 py-2 text-sm text-body">Average attendance: <strong className="text-accent">{attAvg}%</strong></p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="h4 text-heading">Top performers</h3>
            <Badge tone="success">Term average</Badge>
          </div>
          <div className="flex flex-col divide-y divide-line/70">
            {top.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-6 font-semibold text-accent">{i + 1}</span>
                  <div>
                    <p className="font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-body/70">{s.id} · {s.class}</p>
                  </div>
                </div>
                <span className="font-semibold text-heading">{s.avg}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="h4 mb-4 text-heading">Latest announcements</h3>
          <div className="flex flex-col divide-y divide-line/70">
            {announcements.slice(0, 3).map((a) => (
              <div key={a.id} className="py-2.5">
                <div className="flex items-center gap-2">
                  <Badge tone={a.audience === 'All' ? 'accent' : a.audience === 'Staff' ? 'warn' : 'cyan'}>{a.audience}</Badge>
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