/* ==========================================================================
   Brightwell University — demo content (modelled on the Oxford site)
   Free imagery: Unsplash (Unsplash License). Free video: Pixabay (Pixabay
   Content License, royalty-free). All links are stable public hotlinks.
   ========================================================================== */

const u = (id, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const VIDEO = {
  ambient: 'https://cdn.pixabay.com/video/2019/02/16/21472-318172509_large.mp4',
};

export const IMG = {
  hero: u('photo-1541339907198-e08756dedf3f', 2000),
  graduation: u('photo-1523580846011-d3a5bc25702b'),
  studentsGroup: u('photo-1522202176988-66273c2fd55f'),
  studyOutdoor: u('photo-1523240795612-9a054b0db644'),
  hall: u('photo-1524178232363-1fb2b075b655'),
  library: u('photo-1507842217343-583bb7270b66'),
  books: u('photo-1546410531-bb4caa6b424d'),
  classroom: u('photo-1509062522246-3755977927d7'),
  lab: u('photo-1532094349884-543bc11b234d'),
  microscope: u('photo-1581092160562-40aa08e78837'),
  tutoring: u('photo-1456513080510-7bf3a84b82f8'),
  campusLawn: u('photo-1592280771190-3e2e4d571952'),
  studentsWalking: u('photo-1543269865-cbf427effbad'),
  writing: u('photo-1517842645767-c639042777db'),
  conference: u('photo-1544531586-fde5298cdd40'),
  city: u('photo-1513635269975-59663e0ac1ad'),
  field: u('photo-1500382017468-9049fed747ef'),
};

export const brand = {
  name: 'Brightwell University',
  short: 'Brightwell',
  founded: 1843,
  motto: 'Lighting the way to knowledge',
  tagline:
    'Brightwell University provides world-class teaching and research to benefit society on a local, regional, national and global scale.',
  phone: '+234 1 280 4700',
  email: 'info@brightwell.ng',
  address: 'Brightwell Campus, 4 Academic Way, Lagos, Nigeria',
};

export const stats = [
  { value: '24,500', label: 'students studying at Brightwell' },
  { value: '36', label: 'halls, colleges and graduate houses' },
  { value: '44%', label: 'students come from outside Nigeria' },
  { value: '11:1', label: 'student-to-academic-staff ratio' },
  { value: '13m', label: 'printed and digital items held by our libraries' },
];

export const colleges = [
  { name: 'Aminu College', founded: 1862, motto: 'Integritate et labore', blurb: 'A riverside college known for its reading room and botanical court.', colour: '#26d2ff' },
  { name: 'Queen’s Hall', founded: 1878, motto: 'Fiat lux', blurb: 'The oldest all-residential hall, a short walk from the science quarter.', colour: '#26d2ff' },
  { name: 'Okonkwo College', founded: 1890, motto: 'Courage in truth', blurb: 'Nestled in the north garden with studios for the performing arts.', colour: '#26d2ff' },
  { name: 'St. Christopher’s Hall', founded: 1905, motto: 'Vigilate et orate', blurb: 'Famous for its choir, its chapel and its 12-acre playing field.', colour: '#26d2ff' },
  { name: 'Provost House', founded: 1926, motto: 'Sapientia pacis', blurb: 'A graduate house dedicated to research across the humanities.', colour: '#26d2ff' },
  { name: 'Riverton College', founded: 1959, motto: 'Ad astra per astra', blurb: 'A modern collegiate community with a focus on social sciences.', colour: '#26d2ff' },
  { name: 'Ogunbiyi Hall', founded: 1977, motto: 'Unitas et servitium', blurb: 'Brightwell’s youngest hall, built around a central agora and market garden.', colour: '#26d2ff' },
];

export const news = [
  {
    id: 'physics-dual',
    category: 'Physics and mathematics',
    title: 'Scientists observe Einstein’s gravity in the quantum world',
    date: '2026-08-28',
    readTime: '5 minutes',
    excerpt:
      'A Brightwell-led team has measured a gravitational effect predicted 120 years ago, in a system only a few billionths of a metre across.',
    href: '/news/physics-dual',
    img: IMG.microscope,
    tags: ['Research', 'Physical sciences'],
  },
  {
    id: 'erc-grants',
    category: 'Awards and funding',
    title: 'Exceptional early-career researchers awarded European Research Council Starting Grants',
    date: '2026-08-25',
    readTime: '4 minutes',
    excerpt:
      'Six Brightwell academics are among the latest cohort of ERC Starting Grant holders, backing research from malaria control to machine reasoning.',
    href: '/news/erc-grants',
    img: IMG.lab,
    tags: ['Awards', 'Research'],
  },
  {
    id: 'river-restoration',
    category: 'Environment',
    title: 'Engineering students help launch a 40-kilometre river restoration',
    date: '2026-08-22',
    readTime: '3 minutes',
    excerpt:
      'Undergraduates from the School of Engineering worked with community partners to design flood-proud planting for an entire catchment.',
    href: '/news/river-restoration',
    img: IMG.field,
    tags: ['Environment', 'Students'],
  },
  {
    id: 'library-digitisation',
    category: 'Libraries and collections',
    title: 'The medieval manuscripts of the Ogun library begin a new life online',
    date: '2026-08-19',
    readTime: '6 minutes',
    excerpt:
      'Thirteen centuries of manuscripts — many never photographed — are being digitised and made open to the world.',
    href: '/news/manuscripts',
    img: IMG.books,
    tags: ['Digital', 'Collections'],
  },
  {
    id: 'chemistry-phd',
    category: 'Students',
    title: 'Meet the first-year chemistry student building a vaccine cold-chain sensor',
    date: '2026-08-16',
    readTime: '4 minutes',
    excerpt:
      'Brightwell’s innovation fund backed Farida A.; her sensor prototype is now in field trials in four states.',
    href: '/news/chemistry-phd',
    img: IMG.studentsWalking,
    tags: ['Student stories', 'Health science'],
  },
  {
    id: 'roko-professor',
    category: 'Arts and humanities',
    title: 'Professor Roko Kuronjo: On songs, spores and oral histories',
    date: '2026-08-12',
    readTime: '5 minutes',
    excerpt:
      'A profile of the ethnomusicologist who recorded vanishing fungal-farming songs of the Kuronjo people.',
    href: '/news/roko-kuronjo',
    img: IMG.writing,
    tags: ['Arts', 'Profile'],
  },
  {
    id: 'climate-hub',
    category: 'Climate and energy',
    title: 'Brightwell launches a national climate-resilience observatory',
    date: '2026-08-09',
    readTime: '4 minutes',
    excerpt:
      'The centre will tie together satellite data, local rainfall records and economic modelling for coastal cities.',
    href: '/news/climate-hub',
    img: IMG.campusLawn,
    tags: ['Climate', 'Research'],
  },
  {
    id: 'graduation-2026',
    category: 'Graduation',
    title: 'Celebrating the class of 2026 in the Great Hall',
    date: '2026-07-24',
    readTime: '3 minutes',
    excerpt:
      'Twelve thousand finalists, thirty-six colleges, one very long weekend of celebrations.',
    href: '/news/graduation-2026',
    img: IMG.graduation,
    tags: ['Graduation', 'Community'],
  },
];

export const courses = [
  { code: 'HE10', title: 'Biochemistry', degree: 'BA/MMedSc', years: '4', faculty: 'Mathematical, Physical and Life Sciences', area: 'Sciences', blurb: 'The chemical basis of life, from single molecules to whole organisms.' },
  { code: 'FF12', title: 'Computer Science', degree: 'BSc', years: '4', faculty: 'Mathematical, Physical and Life Sciences', area: 'Sciences', blurb: 'Problem solving through programming, theory and systems design.' },
  { code: 'II10', title: 'Economics and Management', degree: 'BA', years: '3', faculty: 'Social Sciences', area: 'Social sciences', blurb: 'The tools of economics and the practice of management in one degree.' },
  { code: 'NQ10', title: 'English Literature', degree: 'BA', years: '3', faculty: 'Humanities', area: 'Humanities', blurb: 'Eight centuries of literature in English, read closely and argued about.' },
  { code: 'VG51', title: 'Fine Art', degree: 'BFA', years: '4', faculty: 'Divisions', area: 'Humanities', blurb: 'Studio practice supported by a world-leading art history faculty.' },
  { code: 'F810', title: 'Geography', degree: 'BA', years: '3', faculty: 'Social Sciences', area: 'Social sciences', blurb: 'The Earth and its peoples — physical and human geography together.' },
  { code: 'L100', title: 'History', degree: 'BA', years: '3', faculty: 'Humanities', area: 'Humanities', blurb: 'How societies have changed, and how we know they have.' },
  { code: 'K410', title: 'Landscape Architecture', degree: 'BA', years: '4', faculty: 'Divisions', area: 'Humanities', blurb: 'Designing landscapes that are beautiful, useful and resilient.' },
  { code: 'M100', title: 'Law', degree: 'BA', years: '3', faculty: 'Divisions', area: 'Social sciences', blurb: 'The jurisprudence of a legal system and the skills to practise it.' },
  { code: 'B140', title: 'Mathematics', degree: 'BA/MMath', years: '4', faculty: 'Mathematical, Physical and Life Sciences', area: 'Sciences', blurb: 'Pure and applied mathematics from first principles.' },
  { code: 'A100', title: 'Medicine', degree: 'BM BCh', years: '6', faculty: 'Medical Sciences', area: 'Medical', blurb: 'A clinical degree taught through hospitals, labs and tutorials.' },
  { code: 'C200', title: 'Music', degree: 'BA', years: '3', faculty: 'Humanities', area: 'Humanities', blurb: 'Composition, performance and musicology under one roof.' },
  { code: 'C500', title: 'Philosophy, Politics and Economics', degree: 'BA', years: '3', faculty: 'Social Sciences', area: 'Social sciences', blurb: 'Three great disciplines that together explain modern societies.' },
  { code: 'B511', title: 'Physics', degree: 'BA/MMathPhys', years: '4', faculty: 'Mathematical, Physical and Life Sciences', area: 'Sciences', blurb: 'From fundamental particles to the large-scale structure of the universe.' },
  { code: 'C800', title: 'Psychology', degree: 'BSc', years: '3', faculty: 'Medical Sciences', area: 'Medical', blurb: 'The science of mind, brain and behaviour.' },
  { code: 'L700', title: 'Sociology', degree: 'BA', years: '3', faculty: 'Social Sciences', area: 'Social sciences', blurb: 'How social life is made, sustained and changed.' },
  { code: 'T900', title: 'Theology and Religion', degree: 'BA', years: '3', faculty: 'Humanities', area: 'Humanities', blurb: 'The world’s religious traditions, studied historically and critically.' },
  { code: 'H810', title: 'Translation', degree: 'BA', years: '4', faculty: 'Humanities', area: 'Humanities', blurb: 'Practice and theory of translation across the languages of West Africa.' },
];

export const graduateCourses = [
  { code: 'PMR', title: 'MBChB Graduate Medicine', degree: 'MB ChB', years: '4', faculty: 'Medical Sciences', area: 'Medical', blurb: 'Accelerated clinical training for graduates of any discipline.' },
  { code: 'MSc', title: 'MSc in Evidence-Based Health Care', degree: 'MSc', years: '2', faculty: 'Medical Sciences', area: 'Medical', blurb: 'Evaluating and applying the research that underpins modern practice.' },
  { code: 'DPhil', title: 'DPhil in Sustainable Urban Development', degree: 'DPhil', years: '4', faculty: 'Social Sciences', area: 'Social sciences', blurb: 'Doctoral research on cities, infrastructure and climate.' },
  { code: 'MSt', title: 'MSt in the History of Medicine', degree: 'MSt', years: '1', faculty: 'Humanities', area: 'Humanities', blurb: 'A one-year programme at the museum and science collections.' },
];

export const researchInstitutes = [
  { name: 'Institute for Infectious Disease', focus: 'Infection and immunology', blurb: 'From outbreak modelling to mRNA vaccines, we study how infections spread and how to stop them.' },
  { name: 'Climate and Energy Centre', focus: 'Climate and energy', blurb: 'Satellite data, local rainfall records and economic modelling come together for coastal cities.' },
  { name: 'Institute of Medical Innovation', focus: 'Health and medicine', blurb: 'Clinicians and engineers co-design devices, diagnostics and data pipelines for Africa’s hospitals.' },
  { name: 'Language and Culture Institute', focus: 'Arts and culture', blurb: 'Digitising endangered languages and musical traditions before they are lost.' },
  { name: 'Centre for Data Governance', focus: 'Society and law', blurb: 'How societies should collect, protect and share data, from the streets to the states.' },
];

export const events = [
  { title: 'Access Brightwell open day', date: '14 Sep 2026', time: '10:00 – 16:00', place: 'Main campus', blurb: 'A free day of taster lectures, campus tours and college visits for prospective students.' },
  { title: 'Meeting Minds weekend', date: '18–20 Sep 2026', time: 'All day', place: 'Colleges and halls', blurb: 'Graduates return for a weekend of seminars, dinners and discoveries.' },
  { title: 'Bodley public lecture: The quantum century', date: '28 Sep 2026', time: '18:30', place: 'Norton Lecture Theatre', blurb: 'A public lecture from the Pearson Professor of Quantum Physics.' },
  { title: 'Alumni festival of creativity', date: '10–11 Oct 2026', time: '10:00 – 18:00', place: 'Museum Quarter', blurb: 'Concerts, poetry and studio openings across the museum quarter.' },
];

export const dosage = {
  resultsCount: 'more than 18,000 students celebrating in the Great Hall',
};

export const home = {
  carousel: [
    { title: 'Oxford in the Conversation', blurb: 'The social chameleon: why a leader with different personas can still be authentic.', img: IMG.tutoring, href: '/news/roko-kuronjo' },
    { title: 'Featured podcast — the NESTL project', blurb: 'Supporting neurodivergent-inclusive teaching and learning in our colleges.', img: IMG.studyOutdoor, href: '/news/erc-grants' },
    { title: 'Physics news — surprising result in dark matter', blurb: 'A quiet detector, a striking anomaly: what the LUX-ZEPLIN result means.', img: IMG.lab, href: '/news/physics-dual' },
    { title: 'Open Doors at the Ogun library', blurb: 'Free but bookable: behind the scenes at one of the world’s great manuscript libraries.', img: IMG.library, href: '/news/manuscripts' },
  ],
};

export const footerColumns = [
  {
    heading: 'Information about',
    links: [
      ['/about', 'Brightwell University'],
      ['/about', 'Strategic plan'],
      ['/research', 'Brightwell’s research'],
      ['/admissions', 'Course fees and funding'],
      ['/about', 'Libraries'],
      ['/about', 'Museums and collections'],
      ['/events', 'Open days'],
      ['/about', 'College glossary'],
      ['/about', 'Equality policy'],
      ['/about', 'Data privacy (GDPR)'],
      ['/events', 'Sport at Brightwell'],
      ['/about', 'Conferences and events'],
    ],
  },
  {
    heading: 'Information for',
    links: [
      ['/admissions', 'Prospective undergraduates'],
      ['/admissions', 'Prospective graduate students'],
      ['/admissions', 'Prospective short-course students'],
      ['/student-life', 'Prospective college members'],
      ['/student-life', 'Current Brightwell students'],
      ['/about', 'Visitors'],
      ['/about', 'Media enquiries'],
      ['/about', 'Alumni'],
      ['/about', 'Teachers and advisers'],
      ['/about', 'Business partners'],
    ],
  },
  {
    heading: 'Quick links',
    links: [
      ['/contact', 'Any questions?'],
      ['/about', 'Jobs and vacancies'],
      ['/events', 'Term dates'],
      ['/about', 'Map and travel'],
      ['/contact', 'Contact us'],
      ['/about', 'Legal'],
      ['/about', 'Privacy notice'],
      ['/about', 'Accessibility statement'],
    ],
  },
];