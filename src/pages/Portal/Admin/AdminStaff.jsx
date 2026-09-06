import React from 'react';
import { PageHeading, DataTable, Badge } from '../../../components/portal/PortalKit.jsx';
import { staff, classes } from '../../../data/school.js';

export default function AdminStaff() {
  const rows = staff.map((t) => [
    <span key="id" className="font-mono text-xs text-accent">{t.id}</span>,
    <div key="name"><p className="font-medium text-ink">{t.name}</p><p className="text-xs text-body/70">{t.email}</p></div>,
    t.subject,
    <Badge key="grp" tone="muted">{t.classGroup}</Badge>,
    t.phone,
  ]);

  const byGroup = [...classes].filter((c) => true);
  const groups = ['Junior Secondary', 'Senior Secondary'].map((g) => ({
    g,
    total: staff.filter((t) => t.classGroup === g).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Teaching staff" subtitle="Subject teachers on the Brightwell faculty" />

      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map(({ g, total }) => (
          <div key={g} className="rounded-xl bg-paper p-5 ring-1 ring-line">
            <p className="text-sm text-body">{g}</p>
            <p className="mt-1 font-heading text-3xl text-heading">{total}</p>
            <p className="mt-1 text-xs text-body/70">
              Courses: {staff.filter((t) => t.classGroup === g).map((t) => t.subject).join(', ')}
            </p>
          </div>
        ))}
      </div>

      <DataTable head={['Staff ID', 'Teacher', 'Subject', 'Category', 'Phone']} rows={rows} />

      <div className="rounded-xl bg-paper p-5 ring-1 ring-line">
        <h3 className="h4 mb-2 text-heading">Class teachers</h3>
        <p className="text-sm text-body">
          {classes.map((c) => `${c.id} — ${c.classTeacher}`).join(' · ')}
        </p>
      </div>
    </div>
  );
}