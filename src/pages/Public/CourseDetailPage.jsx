import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Section, Icon } from '../../components/ui/Kit.jsx';
import { getLearningCourse, allLessons, courseDuration, learningCourses, levelLabel, branchById } from '../../data/learning.js';
import { getPortalUser, ROLE_HOMES } from '../../lib/portalAuth.js';
import NotFoundPage from './NotFoundPage.jsx';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  const user = getPortalUser();

  if (!course) return <NotFoundPage />;

  const lessons = allLessons(course);
  const hours = Math.round(courseDuration(course) / 60);
  const branch = branchById(course.branch);
  const related = learningCourses.filter((c) => c.subject === course.subject && c.slug !== course.slug).slice(0, 4);
  const enrolTo = user
    ? (user.role === 'student' ? `/portal/student/enrol/${course.slug}` : `${ROLE_HOMES[user.role]}?enrol=${course.slug}`)
    : '/portal/login?next=/portal/student/enrol/' + course.slug;

  return (
    <>
      <PageHeader
        title={course.title}
        lead={course.blurb}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/courses', label: 'Courses' },
          { label: course.title },
        ]}
      />

      <Section>
        <div className="c-container grid grid-cols-12 gap-8">
          <article className="col-span-full lg:col-span-8">
            <div className="overflow-hidden rounded-xl ring-1 ring-line">
              <img src={course.img} alt="" className="aspect-video w-full object-cover" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-brand px-2 py-1 text-xs font-semibold text-cyan">{course.subject}</span>
              <span className="tag-pill">{branch.label}</span>
              <span className="tag-pill">{levelLabel(course)}</span>
              <span className="tag-pill">{course.teacher}</span>
              {course.code && <span className="tag-pill">Code {course.code}</span>}
            </div>

            <h2 className="h3 mt-6 text-heading">About this course</h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed">
              This {branch.label} course breaks the subject into manageable lessons with a short video, guided
              notes and worked examples. Learn at your own pace, then check your understanding with the end-of-course
              quiz and put your skills to work in the assignments.
            </p>

            {course.code && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-band/60 px-3 py-2 text-sm text-body">
                <Icon name="badge" className="c-icon--sm fill-accent" />
                Course code <strong className="font-semibold text-heading">{course.code}</strong>
                {course.faculty && <span>· {course.faculty}</span>}
              </p>
            )}

            <h2 className="h3 mt-10 text-heading">What you'll learn</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {course.outline.map((o) => (
                <div key={o} className="flex items-start gap-3 rounded-lg bg-paper p-4 ring-1 ring-line">
                  <Icon name="check-circle" className="c-icon--sm mt-0.5 fill-accent" />
                  <span className="text-sm font-medium text-heading">{o}</span>
                </div>
              ))}
            </div>

            <h2 className="h3 mt-10 text-heading">Syllabus</h2>
            <p className="mt-2 text-sm text-body">
              {course.modules.length} modules · {lessons.length} lessons · about {hours} hours of focused study.
            </p>
            <div className="mt-5 space-y-6">
              {course.modules.map((m, idx) => (
                <div key={m.id} className="overflow-hidden rounded-xl bg-paper ring-1 ring-line">
                  <div className="flex items-center justify-between bg-band/60 px-5 py-3">
                    <h3 className="font-heading text-lg text-heading">
                      <span className="mr-2 text-accent">{String(idx + 1).padStart(2, '0')}.</span>
                      {m.title}
                    </h3>
                    <span className="text-sm text-body">{m.lessons.length} lessons</span>
                  </div>
                  <ul className="divide-y divide-line/60">
                    {m.lessons.map((l, i) => (
                      <li key={l.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-band text-xs font-bold text-accent">
                          {i + 1}
                        </span>
                        <span className="flex-1 font-medium text-ink">{l.title}</span>
                        <span className="flex items-center gap-1 text-xs text-body/70">
                          <Icon name="clock" className="c-icon--xs" />
                          {l.minutes} min
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h2 className="h3 mt-10 text-heading">How you'll be assessed</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-band/40 p-5 ring-1 ring-line">
                <span className="inline-grid size-10 place-items-center rounded-md bg-cyan/15 text-cyan-deep">
                  <Icon name="award" className="c-icon--sm" />
                </span>
                <h3 className="h5 mt-3 text-heading">End-of-course quiz</h3>
                <p className="mt-1 text-sm text-body">
                  {course.quiz.questions.length}-question quiz covering the whole course. Your best score is saved
                  to your learner record.
                </p>
              </div>
              <div className="rounded-xl bg-band/40 p-5 ring-1 ring-line">
                <span className="inline-grid size-10 place-items-center rounded-md bg-pill/20 text-pill-ink">
                  <Icon name="clipboard" className="c-icon--sm" />
                </span>
                <h3 className="h5 mt-3 text-heading">Portfolio assignments</h3>
                <p className="mt-1 text-sm text-body">
                  {course.assignments.length} assignments across the course — short pieces of work graded by your
                  instructor and added to your record.
                </p>
              </div>
            </div>
          </article>

          <aside className="col-span-full lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-xl bg-paper ring-1 ring-line">
                <div className="border-b border-line bg-band/40 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">Self-paced</p>
                  <h2 className="h4 mt-1 text-heading">Enrol to start learning</h2>
                  <p className="mt-2 text-sm text-body">Free for all learners with a Brightwell account.</p>
                </div>
<div className="p-6">
                  <Link to={enrolTo} className="c-button c-button--primary w-full">
                    {user ? 'Enrol & pay' : 'Sign in to enrol'}
                    <Icon name="arrow" className="c-icon--sm" />
                  </Link>
                  <p className="mt-3 text-center text-xs text-body/70">
                    {user
                      ? 'Pay securely — your card is tokenised for next time.'
                      : 'Your progress is saved automatically across devices.'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-paper ring-1 ring-line">
                <div className="border-b border-line p-5">
                  <h2 className="h5 text-heading">Course facts</h2>
                </div>
                <dl className="divide-y divide-line text-sm">
                  {[
                    ['School branch', branch.label],
                    ['Level', levelLabel(course)],
                    ['Duration', course.duration],
                    ['Lessons', `${lessons.length} lessons`],
                    ['Study time', `About ${hours} hours`],
                    ['Instructor', course.teacher],
                    ['Assessment', `${course.quiz.questions.length}-question quiz · ${course.assignments.length} assignments`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between gap-4 px-5 py-3">
                      <dt className="text-body/80">{k}</dt>
                      <dd className="text-right font-semibold text-heading">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {related.length > 0 && (
                <div className="rounded-xl bg-band/60 p-6">
                  <h3 className="h5 text-heading">More {course.subject} courses</h3>
                  <ul className="mt-3 divide-y divide-line/60">
                    {related.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to={`/courses/${c.slug}`}
                          className="animated-underline animated-underline--off hover:animated-underline--on flex items-center justify-between gap-2 py-3 text-sm font-medium text-heading"
                        >
                          <span>{c.title}</span>
                          <Icon name="chevron-right" className="c-icon--xs shrink-0 fill-accent" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}