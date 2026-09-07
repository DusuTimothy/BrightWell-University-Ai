import React from 'react';
import { Link } from 'react-router-dom';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Stat, Badge, EmptyState } from '../../../components/portal/PortalKit.jsx';
import { ProgressPct } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, allLessons, courseProgressPct, levelLabel, branchById } from '../../../data/learning.js';
import { staff, students } from '../../../data/school.js';

export default function TeacherLearning() {
  const user = getPortalUser();
  const me = staff.find((t) => t.id === user.id) || staff[0];
  const myCourses = learningCourses.filter((c) => c.teacherId === me.id);
  const enrolled = students.filter((s) => myCourses.some((c) => c.level === (s.class.startsWith('SS') ? 'SSS' : 'JSS')));
  const totalLessons = myCourses.reduce((a, c) => a + allLessons(c).length, 0);
  const totalAssignments = myCourses.reduce((a, c) => a + c.assignments.length, 0);
  const avgPct = myCourses.length
    ? Math.round(myCourses.reduce((a, c) => a + courseProgressPct(c.slug), 0) / myCourses.length)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My courses"
        subtitle={`${me.name} · ${me.subject} — courses you teach on the platform`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Courses" value={myCourses.length} sub="Running on the platform" icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Total lessons" value={totalLessons} sub="Across your courses" icon={<Icon name="play" className="c-icon--sm" />} />
        <Stat label="Assignments" value={totalAssignments} sub="For you to grade" icon={<Icon name="clipboard" className="c-icon--sm" />} />
        <Stat label="Avg course progress" value={`${avgPct}%`} sub="Across your courses" icon={<Icon name="target" className="c-icon--sm" />} />
      </div>

      {myCourses.length === 0 ? (
        <EmptyState
          title="No courses assigned yet"
          copy="Talk to the platform administrator to add a course to your subject area."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myCourses.map((c) => {
            const lessons = allLessons(c);
            const pct = courseProgressPct(c.slug);
            return (
              <Card key={c.slug}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img src={c.img} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="cyan">{c.subject}</Badge>
                      <Badge tone="muted">{levelLabel(c)}</Badge>
                      <Badge tone="warn">{branchById(c.branch)?.label}</Badge>
                    </div>
                    <h3 className="h5 mt-1 text-heading">{c.title}</h3>
                    <p className="mt-1 text-sm text-body/70">
                      {lessons.length} lessons · {c.modules.length} modules · {c.assignments.length} assignments · {c.quiz.questions.length}-question quiz
                    </p>
                  </div>
                  <div className="flex w-full shrink-0 flex-col gap-2 sm:w-64">
                    <ProgressPct pct={pct} />
                    <Link to={`/portal/teacher/learn/${c.slug}/manage`} className="c-button c-button--secondary !py-2">
                      Manage course
                      <Icon name="chevron-right" className="c-icon--sm" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}