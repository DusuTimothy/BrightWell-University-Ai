/* ==========================================================================
   Brightwell Academy — public site content (e-learning platform)
   Imagery: Unsplash (Unsplash License). All links are stable public hotlinks.
   ========================================================================== */

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  hero: u('photo-1501504905252-473c47e0877c'),
  heroOverlay: u('photo-1522202176988-66273c2fd55f'),
  classroom: u('photo-1524178232363-1fb2b075b655'),
  studentsGroup: u('photo-1523240795612-9a054b0db644'),
  library: u('photo-1507842217343-583bb7270b66'),
  studyOutdoor: u('photo-1517842645767-c639042777db'),
  tutoring: u('photo-1456513080510-7bf3a84b82f8'),
  writing: u('photo-1455390582262-044cdead277a'),
  laptop: u('photo-1517694712202-14dd9538aa97'),
  teaching: u('photo-1571260899304-425eee4c7efc'),
  graduation: u('photo-1523580846011-d3a5bc25702b'),
  conference: u('photo-1543269865-cbf4270effbad'),
};

export const brand = {
  name: 'Brightwell Academy',
  short: 'Brightwell',
  founded: 2018,
  motto: 'Lighting the way to knowledge',
  tagline:
    'Brightwell Academy is a focused online learning platform — video lessons, guided notes, quizzes and assignments for self-paced study.',
  phone: '+234 1 280 4700',
  email: 'learn@brightwell.academy',
  address: 'Brightwell Academy, Lagos, Nigeria',
};

/* Used by the HomePage hero, course library cards, etc. */
export const stats = [
  { value: '14', label: 'courses on the platform' },
  { value: '120+', label: 'video lessons' },
  { value: '7', label: 'instructors' },
  { value: '2', label: 'school branches' },
  { value: '4.7/5', label: 'average learner rating' },
];

export const home = {
  pillars: [
    {
      title: 'Self-paced video lessons',
      copy: 'Bite-sized lessons taught by subject experts — pause, rewind, and learn at the speed that suits you.',
      icon: 'play',
    },
    {
      title: 'End-of-course quizzes',
      copy: 'Each course ends with a multi-question quiz. Your best score is saved to your learner record.',
      icon: 'award',
    },
    {
      title: 'Portfolio assignments',
      copy: 'Submit short pieces of work for every course. Instructors mark and respond to your portfolio.',
      icon: 'clipboard',
    },
  ],
};

export const footerColumns = [
  {
    heading: 'Learn',
    links: [
      ['/courses', 'Browse all courses'],
      ['/courses?branch=university', 'University courses'],
      ['/courses?branch=secondary', 'Secondary School courses'],
      ['/portal/login', 'Sign in to your courses'],
      ['/about', 'How the platform works'],
    ],
  },
  {
    heading: 'For instructors',
    links: [
      ['/portal/login', 'Instructor sign in'],
      ['/about', 'Teaching on Brightwell'],
      ['/about', 'Course guidelines'],
      ['/about', 'Support for instructors'],
    ],
  },
  {
    heading: 'Platform',
    links: [
      ['/about', 'About Brightwell'],
      ['/portal/login', 'Help centre'],
      ['/about', 'Contact us'],
      ['/about', 'Status'],
    ],
  },
];