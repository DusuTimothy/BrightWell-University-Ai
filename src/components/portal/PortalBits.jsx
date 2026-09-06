import React from 'react';
import cn from '../../lib/cn.js';
import { gradeFor } from '../../data/school.js';
import { Badge, Card } from './PortalKit.jsx';

export const fmtNaira = (n) => '₦' + Math.round(n).toLocaleString('en-NG');

export const initials = (name) =>
  (name || '?').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const GRADE_TONE = { A: 'success', B: 'accent', C: 'pill', D: 'warn', F: 'muted' };
export function GradePill({ letter }) {
  return <Badge tone={GRADE_TONE[letter] || 'muted'}>{letter}</Badge>;
}

/* ---------- timetable ---------- */

export function TimetableGrid({ rows, highlightSubject }) {
  if (!rows || rows.length === 0) return null;
  const blocks = rows[0].blocks || [];
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-line">
      <table className="w-full min-w-[760px] border-collapse bg-paper text-sm">
        <thead>
          <tr className="bg-band/70 text-left">
            <th className="px-4 py-3 font-semibold text-royal">Day</th>
            {blocks.map((b) => (
              <th key={b.block} className="px-3 py-3 font-semibold text-royal">
                {b.block}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {rows.map((day) => (
            <tr key={day.day}>
              <td className="px-4 py-3 font-semibold text-ink">{day.day}</td>
              {day.blocks.map((b, i) => (
                <td
                  key={i}
                  className={cn(
                    'px-3 py-3 align-middle text-xs',
                    b.break
                      ? 'bg-off-white-50 italic text-body/60'
                      : highlightSubject && b.subject === highlightSubject
                        ? 'bg-cyan/10 font-semibold text-accent'
                        : 'text-ink'
                  )}
                >
                  {b.break ? (
                    'Break'
                  ) : (
                    <>
                      {b.subject}
                      <span className="block text-[10px] font-normal text-body/70">{b.teacher}</span>
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- results ---------- */

export function ResultsTable({ results, actions }) {
  if (!results || results.length === 0) return null;
  const avg = Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-line">
      <table className="w-full border-collapse bg-paper text-sm">
        <thead>
          <tr className="bg-band/70 text-left">
            <th className="px-4 py-3 font-semibold text-royal">Subject</th>
            <th className="px-4 py-3 font-semibold text-royal">Score</th>
            <th className="px-4 py-3 font-semibold text-royal">Grade</th>
            <th className="px-4 py-3 font-semibold text-royal">Comment</th>
            {actions && <th className="px-4 py-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {results.map((r) => (
            <tr key={r.subject}>
              <td className="px-4 py-3 font-medium text-ink">{r.subject}</td>
              <td className="px-4 py-3 text-ink">{r.score}</td>
              <td className="px-4 py-3">
                <GradePill letter={r.letter} />
              </td>
              <td className="px-4 py-3 text-body">{r.note}</td>
              {actions && <td className="px-4 py-3">{actions(r)}</td>}
            </tr>
          ))}
          <tr className="bg-band/40">
            <td className="px-4 py-3 font-semibold text-ink">Term average</td>
            <td className="px-4 py-3 font-bold text-accent">{avg}</td>
            <td className="px-4 py-3">
              <GradePill letter={gradeFor(avg).letter} />
            </td>
            <td className="px-4 py-3 text-body">{gradeFor(avg).note}</td>
            {actions && <td />}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ---------- announcements ---------- */

export function AnnouncementsList({ items, empty = 'No announcements to display yet.' }) {
  if (!items || items.length === 0) {
    return <p className="rounded-lg bg-slate-50 px-4 py-8 text-center text-sm text-body/70 ring-1 ring-line">{empty}</p>;
  }
  const tone = (aud) => (aud === 'Staff' ? 'warn' : aud === 'Parents' ? 'cyan' : aud === 'Students' ? 'success' : 'accent');
  return (
    <div className="flex flex-col gap-4">
      {items.map((a) => (
        <Card key={a.id} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={tone(a.audience)}>{a.audience}</Badge>
              <span className="text-xs text-body/70">{a.date}</span>
            </div>
            <h3 className="mt-2 font-heading text-lg text-heading">{a.title}</h3>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-body">{a.body}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}