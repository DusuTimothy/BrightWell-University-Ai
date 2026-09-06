import React, { useState } from 'react';
import { PageHeading, DataTable, Badge, SearchInput } from '../../../components/portal/PortalKit.jsx';
import { fmtNaira } from '../../../components/portal/PortalBits.jsx';
import { students, classes, feesFor, averageScore } from '../../../data/school.js';

export default function AdminStudents() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  const rows = students
    .filter((s) => (filter === 'All' ? true : s.class === filter))
    .filter((s) =>
      [s.name, s.id, s.admNo, s.guardian, s.phone].join(' ').toLowerCase().includes(q.toLowerCase())
    )
    .map((s) => {
      const fee = feesFor(s.id);
      const tone = fee.balance === 0 ? 'success' : fee.balance > fee.fee * 0.4 ? 'warn' : 'cyan';
      const balanceLabel = fee.balance === 0 ? 'Paid' : fmtNaira(fee.balance) + ' owed';
      return [
        <span key="adm" className="font-mono text-xs text-accent">{s.id}</span>,
        <div key="name"><p className="font-medium text-ink">{s.name}</p><p className="text-xs text-body/70">{s.admNo}</p></div>,
        <Badge key="cls" tone="muted">{s.class}</Badge>,
        s.gender,
        s.guardian,
        s.phone,
        <span key="avg" className="font-semibold">{averageScore(s.id, s.class)}%</span>,
        <Badge key="fee" tone={tone}>{balanceLabel}</Badge>,
      ];
    });

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Students"
        subtitle={`${students.length} demo records on the school roll`}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent">
              <option>All</option>
              {classes.map((c) => (
                <option key={c.id}>{c.id}</option>
              ))}
            </select>
            <SearchInput value={q} onChange={setQ} placeholder="Search name, ID, guardian…" />
          </div>
        }
      />
      <DataTable
        head={['ADM No', 'Student', 'Class', 'Gender', 'Guardian', 'Phone', 'Avg', 'Fees']}
        rows={rows}
      />
    </div>
  );
}