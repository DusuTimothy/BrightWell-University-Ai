import React, { useState } from 'react';
import { PageHeading, Card } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StudentCalendar() {
  const [refDate] = useState(() => new Date(2026, 8, 7)); // fixed for demo
  const firstDayOfMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();
  const monthName = refDate.toLocaleString('en', { month: 'long', year: 'numeric' });

  // distribute events across the month
  const eventsByDay = {};
  learningCourses.forEach((c, ci) => {
    c.assignments.forEach((a, ai) => {
      const day = ((ci * 4 + ai * 7) % daysInMonth) + 1;
      eventsByDay[day] = eventsByDay[day] || [];
      eventsByDay[day].push({ title: a.title, course: c.title });
    });
  });

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Calendar" subtitle={monthName} />

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b border-line bg-band/60 text-center text-xs font-semibold uppercase tracking-wide text-accent">
          {DAY_NAMES.map((d) => <div key={d} className="py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((d, i) => (
            <div key={i} className={cn('min-h-24 border-b border-r border-line p-2 text-xs', !d && 'bg-off-white-50/40')}>
              {d && (
                <>
                  <p className="text-sm font-semibold text-heading">{d}</p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {(eventsByDay[d] || []).slice(0, 2).map((e, j) => (
                      <li key={j} className="truncate rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent" title={e.title}>
                        {e.title}
                      </li>
                    ))}
                    {(eventsByDay[d] || []).length > 2 && (
                      <li className="text-[10px] text-body/60">+{eventsByDay[d].length - 2} more</li>
                    )}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}