import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading } from '../../../components/portal/PortalKit.jsx';
import { TimetableGrid } from '../../../components/portal/PortalBits.jsx';
import { staff, timetableFor } from '../../../data/school.js';

export default function TeacherTimetable() {
  const user = getPortalUser();
  const me = staff.find((t) => t.id === user.id) || staff[0];
  const rows = timetableFor('SS1');

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My weekly timetable"
        subtitle={`${me.name} — ${me.subject} · SS1 grid with your periods highlighted`}
      />
      <TimetableGrid rows={rows} highlightSubject={me.subject} />
    </div>
  );
}