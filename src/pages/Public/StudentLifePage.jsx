import React from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, Icon, LazyImg, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { IMG } from '../../data/seed.js';

const BLOCKS = [
  {
    title: 'Accommodation',
    body: 'Every first-year student is guaranteed a room for their first two years, and most colleges guarantee accommodation for the whole degree.',
    img: IMG.hall,
    points: ['All colleges offer accommodation on or near campus', 'Communal kitchens and college dining halls', 'Warden support and wellbeing teams in every house'],
  },
  {
    title: 'Clubs and societies',
    body: 'Almost four hundred student-run societies, from debating to drone racing, jazz bands to day of the dead celebrations.',
    img: IMG.studentsGroup,
    points: ['Student union with 40+ sports on offer', 'Music, drama and broadcasting on campus', 'A grant for any society you want to start'],
  },
  {
    title: 'Wellbeing and community',
    body: 'Academic pressures are real, so our support is too — counselling, peer mentoring, college nurses and quiet study time.',
    img: IMG.studyOutdoor,
    points: ['In-house counselling and mental health tests', 'Nightline listening service run by students', 'Protected study weeks with no deadlines'],
  },
];

export default function StudentLifePage() {
  return (
    <>
      <PageHeader
        title="Student life"
        lead="From hall dinners to hackathons, from the boat club to the debating chamber — life at Brightwell is as much about what happens between lectures as inside them."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Student life' }]}
      />

      <Section>
        <div className="c-container">
          <SectionHeader title="What to expect" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {BLOCKS.map((b) => (
              <article key={b.title} className="group/teaser overflow-hidden rounded-xl bg-paper ring-1 ring-line">
                <LazyImg src={b.img} ratio="aspect-[16/9]" />
                <div className="p-6">
                  <h3 className="h4 text-heading">{b.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed">{b.body}</p>
                  <ul className="mt-4 space-y-2.5">
                    {b.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm">
                        <Icon name="arrow" className="c-icon--xs mt-1 -rotate-45 fill-accent" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container grid grid-cols-12 items-center gap-8">
          <div className="col-span-full lg:col-span-6">
            <h2 className="h2 mb-4 text-heading">A day in the life</h2>
            <p className="text-base leading-relaxed">
              “My morning lecture starts at nine, a tutorial at eleven where it’s just me and one other student facing a
              senior academic across a table. Afternoon in the library, then football for the college on the field by the
              river. In the evening, drinks in the college bar or the choir in chapel. It’s intense, but you are never
              alone in it.” — Amina, final year, English
            </p>
            <div className="mt-6">
              <Button to="/admissions">Explore how to apply</Button>
            </div>
          </div>
          <div className="col-span-full lg:col-span-6">
            <LazyImg src={IMG.studentsWalking} ratio="aspect-[16/10]" className="rounded-xl" />
          </div>
        </div>
      </Section>
    </>
  );
}