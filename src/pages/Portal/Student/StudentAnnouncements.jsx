import React from 'react';
import { PageHeading } from '../../../components/portal/PortalKit.jsx';
import { AnnouncementsList } from '../../../components/portal/PortalBits.jsx';
import { announcements, school } from '../../../data/school.js';

export default function StudentAnnouncements() {
  const mine = announcements.filter((a) => a.audience === 'All' || a.audience === 'Students');
  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Announcements"
        subtitle={`News for students · ${school.academicYear} ${school.term}`}
      />
      <AnnouncementsList items={mine} />
    </div>
  );
}