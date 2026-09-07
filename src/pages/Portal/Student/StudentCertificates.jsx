import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, courseProgressPct } from '../../../data/learning.js';

export default function StudentCertificates() {
  const completed = learningCourses.filter((c) => courseProgressPct(c.slug) === 100);
  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Certificates" subtitle="Earn a certificate by completing every lesson in a course." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {completed.length === 0 ? (
          <Card>
            <p className="py-8 text-center text-sm text-body">No certificates yet — finish a course to earn one.</p>
          </Card>
        ) : completed.map((c) => (
          <Card key={c.slug}>
            <Icon name="award" className="c-icon--md fill-pill" />
            <p className="mt-3 text-sm font-semibold text-heading">{c.title}</p>
            <p className="mt-1 text-xs text-body/70">Issued by Brightwell Academy</p>
            <button type="button" className="mt-3 text-sm font-semibold text-accent hover:underline">
              Download PDF →
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}