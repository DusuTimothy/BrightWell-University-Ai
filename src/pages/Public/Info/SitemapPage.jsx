import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../../components/ui/PageHeader.jsx';
import { Section } from '../../../components/ui/Kit.jsx';

const GROUPS = [
  {
    title: 'Study at Brightwell',
    links: [
      ['/admissions', 'Admissions'],
      ['/courses', 'Courses A–Z'],
      ['/courses', 'Undergraduate courses'],
      ['/courses', 'Graduate courses'],
      ['/student-life', 'Student life'],
    ],
  },
  {
    title: 'Research and news',
    links: [
      ['/research', 'Research at Brightwell'],
      ['/news', 'Latest news'],
      ['/events', 'Events and open days'],
      ['/libraries', 'Libraries'],
      ['/museums', 'Museums and collections'],
    ],
  },
  {
    title: 'About the University',
    links: [
      ['/about', 'About Brightwell'],
      ['/strategic-plan', 'Strategic plan'],
      ['/glossary', 'College glossary'],
      ['/term-dates', 'Term dates'],
      ['/sport', 'Sport at Brightwell'],
    ],
  },
  {
    title: 'Visitors and the public',
    links: [
      ['/visitors', 'Visitors'],
      ['/map', 'Map and travel'],
      ['/contact', 'Contact us'],
      ['/media', 'Media enquiries'],
    ],
  },
  {
    title: 'People and community',
    links: [
      ['/alumni', 'Alumni'],
      ['/advisers', 'For teachers and advisers'],
      ['/partnerships', 'Business partners'],
      ['/jobs', 'Jobs and vacancies'],
    ],
  },
  {
    title: 'Policies',
    links: [
      ['/equality', 'Equality policy'],
      ['/privacy', 'Data privacy (GDPR)'],
      ['/cookies', 'Cookie policy'],
      ['/legal', 'Legal'],
      ['/accessibility', 'Accessibility statement'],
    ],
  },
  {
    title: 'Staff and student portal',
    links: [
      ['/portal/login', 'Portal sign in'],
      ['/portal/admin', 'Administrator portal'],
      ['/portal/teacher', 'Teacher portal'],
      ['/portal/student', 'Student portal'],
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <PageHeader
        title="Sitemap"
        lead="Every page on the Brightwell University website, arranged by section. If you cannot find what you need, the search is a good place to start."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Sitemap' }]}
      />
      <Section>
        <div className="c-container">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {GROUPS.map((g) => (
              <nav key={g.title} aria-label={g.title} className="rounded-xl bg-paper p-6 ring-1 ring-line">
                <h2 className="h4 mb-4 text-heading">{g.title}</h2>
                <ul className="flex flex-col gap-2">
                  {g.links.map(([to, label]) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="font-medium animated-underline animated-underline--off hover:animated-underline--on"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}