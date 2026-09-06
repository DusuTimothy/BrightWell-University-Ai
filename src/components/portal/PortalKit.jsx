import React from 'react';
import cn from '../../lib/cn.js';
import { ROLE_ACCENTS } from '../../lib/portalAuth.js';

export function PageHeading({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="h2 text-heading">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-body">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }) {
  return <div className={cn('rounded-xl bg-paper p-5 ring-1 ring-line', className)}>{children}</div>;
}

export function Stat({ label, value, sub, icon, className }) {
  return (
    <Card className={cn('flex items-start justify-between gap-4', className)}>
      <div>
        <p className="text-sm text-body">{label}</p>
        <p className="mt-1 font-heading text-3xl text-heading">{value}</p>
        {sub && <p className="mt-1 text-xs text-body/70">{sub}</p>}
      </div>
      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-band text-accent">{icon}</span>
    </Card>
  );
}

const TONES = {
  accent: 'bg-accent/10 text-accent ring-accent/30',
  success: 'bg-emerald-600/10 text-emerald-700 ring-emerald-600/30',
  warn: 'bg-amber-500/15 text-amber-700 ring-amber-500/40',
  muted: 'bg-slate-500/10 text-slate-600 ring-slate-500/25',
  pill: 'bg-pill/20 text-pill-ink ring-pill/40',
  cyan: 'bg-cyan/15 text-cyan-deep ring-cyan/30',
};

export function Badge({ tone = 'muted', children, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1', TONES[tone] || TONES.muted, className)}>
      {children}
    </span>
  );
}

export function RoleBadge({ role }) {
  const tone = ROLE_ACCENTS[role] || 'muted';
  const label = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Teacher' : 'Student';
  return <Badge tone={tone}>{label}</Badge>;
}

export function Bar({ pct, tone = 'accent' }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
      <div className={cn('h-full rounded-full', tone === 'success' ? 'bg-emerald-500' : tone === 'warn' ? 'bg-amber-500' : 'bg-accent')} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function DataTable({ head, rows, empty = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-body/70 ring-1 ring-line">{empty}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-line">
      <table className="w-full min-w-[640px] border-collapse bg-paper text-sm">
        <thead>
          <tr className="bg-band/70 text-left">
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-semibold text-royal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-band/30">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-middle text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, copy }) {
  return (
    <div className="rounded-xl bg-paper p-12 text-center ring-1 ring-line">
      <p className="h4 text-heading">{title}</p>
      {copy && <p className="mx-auto mt-2 max-w-md text-sm text-body">{copy}</p>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…' }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent sm:max-w-xs"
    />
  );
}