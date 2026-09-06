import React from 'react';
import { PageHeading, DataTable, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { fmtNaira } from '../../../components/portal/PortalBits.jsx';
import { students, feesFor, school } from '../../../data/school.js';

export default function AdminFees() {
  const records = students.map((s) => ({ ...s, ...feesFor(s.id) }));
  const collected = records.reduce((a, r) => a + r.paid, 0);
  const expected = records.reduce((a, r) => a + r.fee, 0);
  const outstanding = expected - collected;

  const rows = records.map((r) => {
    const pct = Math.min(100, Math.round((r.paid / r.fee) * 100));
    const tone = r.balance === 0 ? 'success' : pct >= 60 ? 'cyan' : 'warn';
    return [
      <span key="adm" className="font-mono text-xs text-accent">{r.admNo}</span>,
      <span key="name" className="font-medium text-ink">{r.name}</span>,
      <Badge key="cls" tone="muted">{r.class}</Badge>,
      fmtNaira(r.fee),
      <span key="paid" className="font-semibold text-emerald-700">{fmtNaira(r.paid)}</span>,
      <span key="bal" className="font-semibold">{fmtNaira(r.balance)}</span>,
      <div key="bar" className="w-32">
        <Bar pct={pct} tone={tone} />
      </div>,
      <Badge key="st" tone={tone}>{r.balance === 0 ? 'Paid in full' : pct >= 60 ? 'Partial' : 'Owing'}</Badge>,
    ];
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Fees &amp; payments" subtitle={`${school.term} term tuition · ${fmtNaira(rows.length ? expected / rows.length : 0)} per student`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-body">Expected</p>
          <p className="mt-1 font-heading text-3xl text-heading">{fmtNaira(expected)}</p>
        </div>
        <div className="rounded-xl bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-body">Collected</p>
          <p className="mt-1 font-heading text-3xl text-emerald-700">{fmtNaira(collected)}</p>
        </div>
        <div className="rounded-xl bg-paper p-5 ring-1 ring-line">
          <p className="text-sm text-body">Outstanding</p>
          <p className="mt-1 font-heading text-3xl text-amber-600">{fmtNaira(outstanding)}</p>
        </div>
      </div>

      <DataTable
        head={['Adm No', 'Student', 'Class', 'Term fee', 'Paid', 'Balance', 'Progress', 'Status']}
        rows={rows}
      />
    </div>
  );
}