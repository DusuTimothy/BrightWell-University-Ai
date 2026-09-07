/* ==========================================================================
   Quiz & Question Bank — demo storage.
   - Question bank items are owned per instructor.
   - Quizzes reference questions by id (with optional version pin).
   - Attempts store per-question answers and grading breakdown.
   ========================================================================== */

const BANK_KEY = 'bw_question_bank';
const QUIZZES_KEY = 'bw_quizzes';
const ATTEMPTS_KEY = 'bw_quiz_attempts';
const ASSIGNMENTS_KEY = 'bw_quiz_assignments';

/* ---------- seed: a small bank so the demo isn't empty ---------- */

const SEED_BANK = [
  // Mathematics — Mrs. Ngozi Adeyemi
  { id: 'B-MATH-1', instructorId: 'T-201', type: 'mcq-single', prompt: 'Solve for x in 2x + 5 = 13.', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], correctIndex: 1, points: 1, difficulty: 'easy', tags: ['algebra', 'equations'], createdAt: '2026-01-20' },
  { id: 'B-MATH-2', instructorId: 'T-201', type: 'mcq-single', prompt: 'Factorise x² − 9.', options: ['(x−3)²', '(x−3)(x+3)', '(x+9)(x−1)', 'x(x−9)'], correctIndex: 1, points: 1, difficulty: 'easy', tags: ['algebra'], createdAt: '2026-01-20' },
  { id: 'B-MATH-3', instructorId: 'T-201', type: 'tf',       prompt: 'The gradient of the line y = 3x − 2 is 3.', correct: true, points: 1, difficulty: 'easy', tags: ['graphs'], createdAt: '2026-01-20' },
  { id: 'B-MATH-4', instructorId: 'T-201', type: 'mcq-single', prompt: 'What is sin 30° (exact value)?', options: ['1', '1/2', '√3/2', '1/√2'], correctIndex: 1, points: 1, difficulty: 'medium', tags: ['trigonometry'], createdAt: '2026-01-20' },
  { id: 'B-MATH-5', instructorId: 'T-201', type: 'short',     prompt: 'Solve: 2x − 6 = 0. Enter x =', acceptableAnswers: ['3'], points: 2, difficulty: 'easy', tags: ['algebra'], createdAt: '2026-01-20' },
  { id: 'B-MATH-6', instructorId: 'T-201', type: 'essay',     prompt: 'Explain in your own words how completing the square solves a quadratic equation.', points: 5, difficulty: 'hard', tags: ['algebra'], createdAt: '2026-01-20', rubric: { clarity: 2, accuracy: 2, examples: 1 } },

  // Physics — Dr. Emeka Nwosu
  { id: 'B-PHY-1', instructorId: 'T-202', type: 'mcq-single', prompt: 'Which of these is a scalar quantity?', options: ['Velocity', 'Displacement', 'Speed', 'Acceleration'], correctIndex: 2, points: 1, difficulty: 'easy', tags: ['measurement'], createdAt: '2026-01-22' },
  { id: 'B-PHY-2', instructorId: 'T-202', type: 'tf',       prompt: 'F = ma is Newton\'s second law.', correct: true, points: 1, difficulty: 'easy', tags: ['forces'], createdAt: '2026-01-22' },
  { id: 'B-PHY-3', instructorId: 'T-202', type: 'mcq-single', prompt: 'The unit of work is the…', options: ['watt', 'newton', 'joule', 'ampere'], correctIndex: 2, points: 1, difficulty: 'medium', tags: ['energy'], createdAt: '2026-01-22' },
  { id: 'B-PHY-4', instructorId: 'T-202', type: 'short',     prompt: 'A car accelerates from rest at 2 m/s² for 3 s. Its final speed (m/s) is…', acceptableAnswers: ['6'], points: 2, difficulty: 'medium', tags: ['kinematics'], createdAt: '2026-01-22' },
  { id: 'B-PHY-5', instructorId: 'T-202', type: 'essay',     prompt: 'Reflect on Newton\'s third law in 150–200 words. Use one everyday example.', points: 6, difficulty: 'hard', tags: ['forces'], createdAt: '2026-01-22', rubric: { clarity: 2, accuracy: 3, examples: 1 } },

  // English — Miss Adaku Eze
  { id: 'B-ENG-1', instructorId: 'T-203', type: 'mcq-single', prompt: 'Which sentence is punctuated correctly?', options: ['Its cold today.', "It's cold today.", 'Its’ cold today.', "It's a cold day, today."], correctIndex: 1, points: 1, difficulty: 'easy', tags: ['grammar'], createdAt: '2026-01-25' },
  { id: 'B-ENG-2', instructorId: 'T-203', type: 'mcq-single', prompt: '"Although it rained, the match continued." is a…', options: ['simple sentence', 'compound sentence', 'complex sentence', 'sentence fragment'], correctIndex: 2, points: 1, difficulty: 'medium', tags: ['grammar'], createdAt: '2026-01-25' },
  { id: 'B-ENG-3', instructorId: 'T-203', type: 'tf',       prompt: 'A summary should be longer than the original.', correct: false, points: 1, difficulty: 'easy', tags: ['summary'], createdAt: '2026-01-25' },

  // Computer Studies — Mr. Tunde Bakare
  { id: 'B-COM-1', instructorId: 'T-207', type: 'mcq-single', prompt: 'Which is hardware?', options: ['A web browser', 'The keyboard', 'An operating system', 'A game'], correctIndex: 1, points: 1, difficulty: 'easy', tags: ['hardware'], createdAt: '2026-01-26' },
  { id: 'B-COM-2', instructorId: 'T-203', type: 'mcq-single', prompt: 'Which symbol represents a decision in a flowchart?', options: ['rectangle', 'oval', 'diamond', 'arrow'], correctIndex: 2, points: 1, difficulty: 'easy', tags: ['algorithms'], createdAt: '2026-01-26' },
];

const SEED_QUIZZES = [
  {
    id: 'Q-MATH-UNIT',
    instructorId: 'T-201',
    courseId: 'mathematics-core',
    moduleId: null,
    title: 'Core Mathematics — Unit test',
    description: 'A short test covering algebra, graphs, and trigonometry.',
    type: 'graded',
    status: 'live',
    questions: ['B-MATH-1', 'B-MATH-2', 'B-MATH-3', 'B-MATH-4', 'B-MATH-5'],
    poolSize: null,
    rules: { timeLimitMin: 20, attempts: 3, passingScore: 50, layout: 'paginated', feedbackMode: 'after_due' },
    availability: { from: '2026-08-01', until: '2026-12-31' },
    antiCheat: { trackFocus: true, maxFocusLosses: 3, fullscreen: false },
    createdAt: '2026-08-10',
  },
  {
    id: 'Q-PHY-UNIT',
    instructorId: 'T-202',
    courseId: 'physics-experiments',
    moduleId: null,
    title: 'Motion & Mechanics test',
    description: 'Tests on motion, forces and the conservation of energy.',
    type: 'graded',
    status: 'live',
    questions: ['B-PHY-1', 'B-PHY-2', 'B-PHY-3', 'B-PHY-4'],
    poolSize: null,
    rules: { timeLimitMin: 25, attempts: 2, passingScore: 50, layout: 'paginated', feedbackMode: 'immediate' },
    availability: { from: '2026-08-01', until: '2026-12-31' },
    antiCheat: { trackFocus: true, maxFocusLosses: 3, fullscreen: false },
    createdAt: '2026-08-12',
  },
  {
    id: 'Q-PHY-ESSAY',
    instructorId: 'T-202',
    courseId: 'physics-experiments',
    moduleId: null,
    title: 'Newton\'s third law — short essay',
    description: 'A reflective essay on action-reaction pairs in everyday life.',
    type: 'graded',
    status: 'live',
    questions: ['B-PHY-5'],
    poolSize: null,
    rules: { timeLimitMin: 30, attempts: 1, passingScore: 50, layout: 'single', feedbackMode: 'manual' },
    availability: { from: '2026-08-15', until: '2026-12-31' },
    antiCheat: { trackFocus: false, maxFocusLosses: 99, fullscreen: false },
    createdAt: '2026-08-15',
  },
  {
    id: 'Q-ENG-QUIZ',
    instructorId: 'T-203',
    courseId: 'english-language',
    moduleId: null,
    title: 'English — Grammar & style test',
    description: 'Covers punctuation, sentence structure and summary writing.',
    type: 'graded',
    status: 'live',
    questions: ['B-ENG-1', 'B-ENG-2', 'B-ENG-3'],
    poolSize: null,
    rules: { timeLimitMin: 15, attempts: 3, passingScore: 50, layout: 'paginated', feedbackMode: 'immediate' },
    availability: { from: '2026-08-01', until: '2026-12-31' },
    antiCheat: { trackFocus: true, maxFocusLosses: 3, fullscreen: false },
    createdAt: '2026-08-09',
  },
];

/* ---------- storage helpers ---------- */

function read(key, seed) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(seed));
      return JSON.parse(JSON.stringify(seed));
    }
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(seed));
  }
}
function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

/* ---------- Question Bank ---------- */

export function listBank(instructorId = null) {
  const items = read(BANK_KEY, SEED_BANK);
  return instructorId ? items.filter((q) => q.instructorId === instructorId) : items;
}
export function getBankItem(id) {
  return listBank().find((q) => q.id === id) || null;
}
export function saveBankItem(item) {
  const items = listBank();
  const idx = items.findIndex((q) => q.id === item.id);
  if (idx >= 0) items[idx] = { ...items[idx], ...item };
  else items.push({ ...item, createdAt: item.createdAt || new Date().toISOString().slice(0, 10) });
  write(BANK_KEY, items);
  return items.find((q) => q.id === item.id);
}
export function deleteBankItem(id) {
  const items = listBank().filter((q) => q.id !== id);
  write(BANK_KEY, items);
}

/* ---------- Quizzes ---------- */

export function listQuizzes(instructorId = null) {
  const items = read(QUIZZES_KEY, SEED_QUIZZES);
  return instructorId ? items.filter((q) => q.instructorId === instructorId) : items;
}
export function getQuiz(id) {
  return listQuizzes().find((q) => q.id === id) || null;
}
export function saveQuiz(quiz) {
  const items = listQuizzes();
  const idx = items.findIndex((q) => q.id === quiz.id);
  if (idx >= 0) items[idx] = { ...items[idx], ...quiz };
  else items.push(quiz);
  write(QUIZZES_KEY, items);
  return items.find((q) => q.id === quiz.id);
}
export function deleteQuiz(id) {
  write(QUIZZES_KEY, listQuizzes().filter((q) => q.id !== id));
}

export function newQuizId() {
  return 'Q-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* ---------- Attempts ---------- */

export function listAttempts(quizId) {
  const all = read(ATTEMPTS_KEY, []);
  return all.filter((a) => a.quizId === quizId);
}
export function listAttemptsByUser(userId) {
  return read(ATTEMPTS_KEY, []).filter((a) => a.userId === userId);
}
export function getAttempt(attemptId) {
  return read(ATTEMPTS_KEY, []).find((a) => a.id === attemptId) || null;
}
export function saveAttempt(attempt) {
  const all = read(ATTEMPTS_KEY, []);
  const idx = all.findIndex((a) => a.id === attempt.id);
  if (idx >= 0) all[idx] = attempt;
  else all.push(attempt);
  write(ATTEMPTS_KEY, all);
  return attempt;
}

/* ---------- Manual-grading queue (assignments of essay quizzes) ---------- */

export function listManualGradingItems(quizId) {
  return listAttempts(quizId).filter((a) =>
    a.grading && Object.values(a.grading).some((g) => g.status === 'manual_pending' || g.status === 'manual_graded')
  );
}

export function recordEssayGrade(attemptId, questionId, pointsEarned, comment) {
  const all = read(ATTEMPTS_KEY, []);
  const idx = all.findIndex((a) => a.id === attemptId);
  if (idx < 0) return null;
  const a = all[idx];
  a.grading = a.grading || {};
  a.grading[questionId] = {
    pointsEarned,
    status: 'manual_graded',
    feedback: comment,
    gradedAt: new Date().toISOString().slice(0, 10),
  };
  // recompute total
  a.totalScore = Object.values(a.grading).reduce((acc, g) => acc + (g.pointsEarned || 0), 0);
  write(ATTEMPTS_KEY, all);
  return a;
}

/* ---------- Class-wide rollup for analytics ---------- */

export function classAnalytics(quizId) {
  const attempts = listAttempts(quizId).filter((a) => a.status === 'submitted');
  const quiz = getQuiz(quizId);
  if (!quiz || attempts.length === 0) {
    return { attempts: 0, passRate: 0, median: 0, avgTime: 0, distribution: [], itemAnalysis: [], integrityFlags: 0 };
  }

  const pctList = attempts.map((a) => {
    const max = quiz.questions.reduce((s, qid) => s + (getBankItem(qid)?.points || 1), 0);
    return Math.round((a.totalScore / max) * 100);
  });

  const sorted = [...pctList].sort((x, y) => x - y);
  const median = pctMedian(sorted);
  const passRate = Math.round((pctList.filter((p) => p >= quiz.rules.passingScore).length / pctList.length) * 100);
  const avgTime = Math.round(attempts.reduce((acc, a) => acc + ((a.endedAt - a.startedAt) / 60000), 0) / attempts.length);

  const distribution = [0, 0, 0, 0, 0]; // 0–20, 21–40, 41–60, 61–80, 81–100
  pctList.forEach((p) => {
    if (p <= 20) distribution[0]++;
    else if (p <= 40) distribution[1]++;
    else if (p <= 60) distribution[2]++;
    else if (p <= 80) distribution[3]++;
    else distribution[4]++;
  });

  // item analysis
  const itemAnalysis = quiz.questions.map((qid) => {
    const item = getBankItem(qid);
    const correct = attempts.filter((a) => a.answers?.[qid]?.correct).length;
    const total = attempts.length;
    const correctRate = total ? correct / total : 0;
    const avgTimeSec = attempts.reduce((acc, a) => acc + (a.answers?.[qid]?.timeMs || 0) / 1000, 0) / (total || 1);
    // discrimination = avg correctness in top quartile − avg correctness in bottom quartile
    const top = pctList.filter((p) => p >= 75).length;
    const bot = pctList.filter((p) => p <= 25).length;
    const correctTop = attempts.filter((a, i) => pctList[i] >= 75 && a.answers?.[qid]?.correct).length;
    const correctBot = attempts.filter((a, i) => pctList[i] <= 25 && a.answers?.[qid]?.correct).length;
    const discrim = top && bot ? (correctTop / top) - (correctBot / bot) : 0;
    return {
      questionId: qid,
      prompt: item?.prompt || '',
      type: item?.type || 'mcq',
      correctRate,
      avgTimeSec,
      discrim,
      flag:
        correctRate < 0.3 && discrim < 0 ? 'review'
          : correctRate < 0.5 ? 'hard'
          : null,
    };
  });

  const integrityFlags = attempts.reduce((acc, a) => acc + (a.integrityFlags?.focusLosses > a.integrityFlags?.maxFocusLosses ? 1 : 0), 0);

  return { attempts: attempts.length, passRate, median, avgTime, distribution, itemAnalysis, integrityFlags };
}

function pctMedian(sorted) {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}