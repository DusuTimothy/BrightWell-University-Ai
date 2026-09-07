import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, getSubmission, saveSubmission, getGrade } from '../../../data/learning.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { students } from '../../../data/school.js';

export default function StudentAssignments() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  const user = getPortalUser();
  const me = students.find((s) => s.id === user.id) || students[3];
  const [drafts, setDrafts] = useState({});
  const [saved, setSaved] = useState({});

  if (!course) return <Navigate to="/portal/student/learn" replace />;

  function submit(a, e) {
    e.preventDefault();
    const text = (drafts[a.id] || '').trim();
    if (!text) return;
    saveSubmission(course.slug, a.id, text);
    setSaved((s) => ({ ...s, [a.id]: true }));
    setDrafts((d) => ({ ...d, [a.id]: '' }));
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/portal/student/learn/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        {course.title}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="h2 text-heading">Assignments</h1>
          <p className="mt-1 text-sm text-body">
            {course.assignments.length} open pieces of work · graded by {course.teacher}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {course.assignments.map((a) => {
          const submission = getSubmission(course.slug, a.id);
          const grade = getGrade(a.id, me.id);
          return (
            <Card key={a.id} className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="warn">{a.kind}</Badge>
                <Badge tone="muted">{a.points} pts</Badge>
                {submission && <Badge tone="success">Submitted</Badge>}
                {grade != null && <Badge tone="accent">Grade: {grade}/{a.points}</Badge>}
              </div>
              <h3 className="h5 mt-3 text-heading">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{a.prompt}</p>

              {grade != null ? (
                <div className="mt-4 rounded-lg bg-band/60 p-3 text-sm text-ink">
                  <p className="flex items-center gap-2 font-semibold text-heading">
                    <Icon name="file-check" className="c-icon--sm fill-accent" />
                    Marked: {grade}/{a.points} pts
                  </p>
                  <p className="mt-1 text-body">Your instructor has recorded this grade on your record.</p>
                </div>
              ) : submission ? (
                <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">
                  <p className="font-semibold">Submitted {submission.date}</p>
                  <p className="mt-1 line-clamp-2 text-emerald-700">{submission.text}</p>
                </div>
              ) : saved[a.id] ? (
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <Icon name="check-circle" className="c-icon--sm fill-emerald-500" />
                  Submitted — thank you.
                </div>
              ) : (
                <form onSubmit={(e) => submit(a, e)} className="mt-4 flex flex-col gap-2">
                  <label className="text-xs font-semibold text-body/80">Your response</label>
                  <textarea
                    rows={4}
                    required
                    value={drafts[a.id] || ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [a.id]: e.target.value }))}
                    placeholder="Paste your work here, or write a short note about your submission…"
                    className="w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
                  />
                  <button type="submit" className="c-button c-button--primary self-start !py-2.5">
                    Submit assignment
                    <Icon name="arrow" className="c-icon--sm" />
                  </button>
                </form>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}