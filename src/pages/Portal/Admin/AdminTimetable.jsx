import React, { useState } from 'react';
import { PageHeading, Badge } from '../../../components/portal/PortalKit.jsx';
import { TimetableGrid } from '../../../components/portal/PortalBits.jsx';
import { classes, timetableFor } from '../../../data/school.js';
import cn from '../../../lib/cn.js';

export default function AdminTimetable() {
  const [selected, setSelected] = useState('SS1');
  const rows = timetableFor(selected);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="School timetable"
        subtitle={`${selected} · ${rows[0]?.blocks?.filter((b) => !b.break).length ?? 0} taught periods a day`}
        actions={
          <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
            {classes.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  selected === c.id ? 'bg-accent text-white' : 'text-body hover:text-heading'
                )}
              >
                {c.id}
              </button>
            ))}
          </div>
        }
      />

      <div className="flex items-center gap-2 text-sm text-body">
        <Badge tone="cyan">Highlighted</Badge>
        <span>cells mark lunch &amp; break.</span>
      </div>

      <TimetableGrid rows={rows} />
    </div>
  );
}