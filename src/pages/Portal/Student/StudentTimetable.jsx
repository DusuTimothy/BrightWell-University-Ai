import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { TimetableGrid } from '../../../components/portal/PortalBits.jsx';
import { students, timetableFor, todayDay } from '../../../data/school.js';

export default function StudentTimetable() {
  const user = getPortalUser();
  const me = students.find((s) => s.id === user.id) || students[3];
  const rows = timetableFor(me.class);
  const today = todayDay();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My timetable"
        subtitle={`${me.class} · ${me.name}`}
        actions={
          <Badge tone="cyan">
            Today: {today}
          </Badge>
        }
      />
      <Card>
        <p className="text-sm leading-relaxed text-body">
          Periods run Monday to Friday, 8:00am – 3:10pm, with a 50-minute break after Period 3.
          Your current day is highlighted in the sidebar — plan ahead for the week below.
        </p>
      </Card>
      <TimetableGrid rows={rows} />
    </div>
  );
}