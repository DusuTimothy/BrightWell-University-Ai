/* ==========================================================================
   Brightwell Academy — platform roster data (e-learning)
   This data powers the role-based demo portal: admin, instructors and learners.
   Deterministic pseudo-random generators keep the file small while giving
   every learner stable demo records across reloads.
   ========================================================================== */

export const school = {
  name: 'Brightwell Academy',
  short: 'Brightwell',
  academicYear: '2025/2026',
  term: 'Spring Term',
  address: 'Brightwell Academy, Lagos, Nigeria',
};

export const classes = [
  { id: 'JSS1', name: 'Junior Secondary 1', classTeacher: 'Miss Adaku Eze', students: 32 },
  { id: 'JSS2', name: 'Junior Secondary 2', classTeacher: 'Mr. Tunde Bakare', students: 30 },
  { id: 'JSS3', name: 'Junior Secondary 3', classTeacher: 'Mrs. Funmilayo Sanni', students: 31 },
  { id: 'SS1', name: 'Senior Secondary 1', classTeacher: 'Mrs. Ngozi Adeyemi', students: 34 },
  { id: 'SS2', name: 'Senior Secondary 2', classTeacher: 'Dr. Emeka Nwosu', students: 33 },
  { id: 'SS3', name: 'Senior Secondary 3', classTeacher: 'Mr. Ibrahim Suleiman', students: 29 },
];

export const staff = [
  { id: 'T-201', name: 'Mrs. Ngozi Adeyemi', subject: 'Mathematics', classGroup: 'Senior Secondary', phone: '+234 803 100 0201', email: 'n.adeyemi@brightwell.academy' },
  { id: 'T-202', name: 'Dr. Emeka Nwosu', subject: 'Physics', classGroup: 'Senior Secondary', phone: '+234 803 100 0202', email: 'e.nwosu@brightwell.academy' },
  { id: 'T-203', name: 'Miss Adaku Eze', subject: 'English Language', classGroup: 'Junior Secondary', phone: '+234 803 100 0203', email: 'a.eze@brightwell.academy' },
  { id: 'T-204', name: 'Mrs. Funmilayo Sanni', subject: 'Basic Science', classGroup: 'Junior Secondary', phone: '+234 803 100 0204', email: 'f.sanni@brightwell.academy' },
  { id: 'T-205', name: 'Mr. Ibrahim Suleiman', subject: 'Further Mathematics', classGroup: 'Senior Secondary', phone: '+234 803 100 0205', email: 'i.suleiman@brightwell.academy' },
  { id: 'T-206', name: 'Mrs. Halima Yusuf', subject: 'Biology', classGroup: 'Senior Secondary', phone: '+234 803 100 0206', email: 'h.yusuf@brightwell.academy' },
  { id: 'T-207', name: 'Mr. Tunde Bakare', subject: 'Computer Studies', classGroup: 'Junior Secondary', phone: '+234 803 100 0207', email: 't.bakare@brightwell.academy' },
  { id: 'T-208', name: 'Mrs. Grace Adeleke', subject: 'Economics', classGroup: 'Senior Secondary', phone: '+234 803 100 0208', email: 'g.adeleke@brightwell.academy' },
];

export const subjects = [
  'Mathematics',
  'English Language',
  'Physics',
  'Chemistry',
  'Biology',
  'Further Mathematics',
  'Economics',
  'Literature in English',
  'Computer Studies',
  'Basic Science',
];

export const students = [
  { id: 'BWS-0001', admNo: 'BWS-2022-001', name: 'Adaeze Onyema', gender: 'F', class: 'SS2', guardian: 'Mr. C. Onyema', phone: '+234 802 111 0001' },
  { id: 'BWS-0002', admNo: 'BWS-2023-008', name: 'Tunde Balogun', gender: 'M', class: 'SS1', guardian: 'Mrs. R. Balogun', phone: '+234 802 111 0002' },
  { id: 'BWS-0003', admNo: 'BWS-2022-014', name: 'Aisha Mohammed', gender: 'F', class: 'JSS3', guardian: 'Mr. A. Mohammed', phone: '+234 802 111 0003' },
  { id: 'BWS-0004', admNo: 'BWS-2024-021', name: 'Chidinma Okafor', gender: 'F', class: 'SS1', guardian: 'Mrs. J. Okafor', phone: '+234 802 111 0004' },
  { id: 'BWS-0005', admNo: 'BWS-2023-011', name: 'Damilola Adekunle', gender: 'M', class: 'SS3', guardian: 'Dr. K. Adekunle', phone: '+234 802 111 0005' },
  { id: 'BWS-0006', admNo: 'BWS-2021-003', name: 'Emeka Umeh', gender: 'M', class: 'SS3', guardian: 'Mr. P. Umeh', phone: '+234 802 111 0006' },
  { id: 'BWS-0007', admNo: 'BWS-2024-030', name: 'Fatima Sani', gender: 'F', class: 'JSS1', guardian: 'Mrs. L. Sani', phone: '+234 802 111 0007' },
  { id: 'BWS-0008', admNo: 'BWS-2022-019', name: 'Gbenga Lawal', gender: 'M', class: 'JSS2', guardian: 'Mr. O. Lawal', phone: '+234 802 111 0008' },
  { id: 'BWS-0009', admNo: 'BWS-2023-017', name: 'Hauwa Ibrahim', gender: 'F', class: 'SS2', guardian: 'Mrs. Z. Ibrahim', phone: '+234 802 111 0009' },
  { id: 'BWS-0010', admNo: 'BWS-2024-026', name: 'Ibrahim Musa', gender: 'M', class: 'SS1', guardian: 'Mr. S. Musa', phone: '+234 802 111 0010' },
  { id: 'BWS-0011', admNo: 'BWS-2023-009', name: 'Joy Ekwueme', gender: 'F', class: 'JSS3', guardian: 'Mrs. N. Ekwueme', phone: '+234 802 111 0011' },
  { id: 'BWS-0012', admNo: 'BWS-2022-006', name: 'Kelechi Obi', gender: 'M', class: 'SS2', guardian: 'Mr. V. Obi', phone: '+234 802 111 0012' },
];

const TERM_FEE = 385000;
export const sessionDates = { resumption: '2025-09-08', midTerm: '2025-10-20', exams: '2025-12-01', closing: '2025-12-19' };

/* ---------- deterministic helpers ---------- */

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function scoreFor(studentId, subject) {
  return 42 + (hash(studentId + '::' + subject + '::' + school.term) % 54);
}

export function gradeFor(score) {
  if (score >= 75) return { letter: 'A', note: 'Excellent' };
  if (score >= 65) return { letter: 'B', note: 'Very Good' };
  if (score >= 55) return { letter: 'C', note: 'Good' };
  if (score >= 45) return { letter: 'D', note: 'Credit' };
  return { letter: 'F', note: 'Fail' };
}

export function studentResults(studentId, classId) {
  const pool =
    classId.startsWith('SS') || classId.includes('SS')
      ? ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Economics', 'Literature in English']
      : ['Mathematics', 'English Language', 'Basic Science', 'Computer Studies'];
  return pool.map((subject) => {
    const score = scoreFor(studentId, subject);
    const g = gradeFor(score);
    return { subject, score, ...g };
  });
}

export function averageScore(studentId, classId) {
  const r = studentResults(studentId, classId);
  return Math.round(r.reduce((a, b) => a + b.score, 0) / r.length);
}

export function classPosition(studentId, classId) {
  const roster = students.filter((s) => s.class === classId);
  const mine = averageScore(studentId, classId);
  return 1 + roster.filter((s) => averageScore(s.id, classId) > mine).length;
}

export function feesFor(studentId) {
  const factor = hash(studentId + '::fees') % 100;
  const paid = factor < 15 ? Math.round((TERM_FEE * 0.6) / 500) * 500 : factor < 40 ? Math.round((TERM_FEE * 0.85) / 500) * 500 : TERM_FEE;
  return { term: `${school.academicYear} · ${school.term}`, fee: TERM_FEE, paid, balance: TERM_FEE - paid };
}

export function attendanceFor(classId) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days.map((day, i) => {
    const present = hash(classId + '::' + day) % 7;
    const enrolled = classes.find((c) => c.id === classId)?.students ?? 30;
    const absent = Math.min(4, present);
    return { day, date: `Wk ${5 + i}`, enrolled, present: enrolled - absent, absent };
  });
}

const BLOCKS = ['Period 1', 'Period 2', 'Period 3', 'Lunch & break', 'Period 4', 'Period 5'];
export function timetableFor(classId) {
  const roster =
    classId.startsWith('SS3') ? subjects.filter((s) => ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics'].includes(s))
    : classId.startsWith('SS') ? ['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Further Mathematics', 'Economics', 'Literature in English']
    : ['Mathematics', 'English Language', 'Basic Science', 'Computer Studies'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return days.map((day, d) => ({
    day,
    blocks: BLOCKS.map((block, b) => {
      if (block === 'Lunch & break') return { block, subject: '', teacher: '', break: true };
      const idx = (hash(classId + '::' + day) + b * 3) % roster.length;
      const subject = roster[idx];
      const who = staff.find((t) => t.subject === subject);
      return { block, subject, teacher: who ? who.name : '—' };
    }),
  }));
}

export const announcements = [
  { id: 'A1', date: '2026-09-04', audience: 'All', title: 'New courses published for the term', body: 'Two new courses have been added to the catalogue — Data Science and Research Methods. Enrol now from your learner dashboard.' },
  { id: 'A2', date: '2026-09-01', audience: 'Instructors', title: 'Assignment grading window opens', body: 'Instructors can begin grading this term\'s assignments from Friday. Use the Manage Course page to record grades.' },
  { id: 'A3', date: '2026-08-27', audience: 'All', title: 'Spring term kick-off webinar', body: 'Join the team for a 30-minute platform tour on Saturday — learn how to plan your study time and use the lesson player.' },
];

export function todayDay() {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
}