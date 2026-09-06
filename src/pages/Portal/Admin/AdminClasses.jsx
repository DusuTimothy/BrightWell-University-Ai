import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../../../components/ui/Kit.jsx';
import { PageHeading, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { classes, attendanceFor } from '../../../data/school.js';

export default function AdminClasses() {
  const maxClass = Math.max(...classes.map((c) => c.students));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Classes" subtitle="Six classes across the junior and senior secondary sections" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => {
          const att = attendanceFor(c.id);
          const avg = Math.round(att.reduce((a, d) => a + (d.present / d.enrolled) * 100, 0) / att.length);
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl bg-paper p-5 ring-1 ring-line">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-accent">{c.id}</p>
                  <h3 className="h4 mt-1 text-heading">{c.name}</h3>
                </div>
                <Badge tone="muted">{c.students} students</Badge>
              </div>
              <p className="text-sm text-body">Class teacher: <span className="font-medium text-ink">{c.classTeacher}</span></p>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-body">
                  <span>Attendance this week</span>
                  <span>{avg}%</span>
                </div>
                <Bar pct={avg} tone={avg >= 90 ? 'success' : avg >= 80 ? 'accent' : 'warn'} />
              </div>
              <div className="mt-auto flex gap-2">
                <Link to="/portal/admin/timetable" className="rounded-md bg-band px-3 py-2 text-xs font-semibold text-accent hover:bg-band/70">Timetable</Link>
                <Link to="/portal/admin/grades" className="rounded-md bg-band px-3 py-2 text-xs font-semibold text-accent hover:bg-band/70">Performance</Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-off-white-50 p-5 text-sm text-body ring-1 ring-line">
        <span className="flex items-center gap-2">
          <Icon name="graduation-cap" className="c-icon--sm fill-accent" />
          Total enrolment across all classes: <strong className="text-heading">{classes.reduce((a, c) => a + c.students, 0)}</strong> — pupil-to-teacher ratio 1:{Math.round(classes.reduce((a, c) => a + c.students, 0) / 8)}.
        </span>
      </div>
    </div>
  );
}