/* ==========================================================================
   Quiz auto-grading engine.
   Pure functions — given a quiz + answers, produce a graded attempt.
   Anti-cheat state (focus losses, paste blocks, time-bank) is plumbed through.
   ========================================================================== */

import { getBankItem } from './quizzes.js';

/* Shuffle an array (Fisher-Yates, seedable for deterministic replays) */
function shuffle(arr, seed) {
  const out = [...arr];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function shuffleAttempt(quiz, attemptIdSeed) {
  const indices = quiz.questions.map((_, i) => i);
  const questionOrder = shuffle(indices, attemptIdSeed);
  const optionOrders = {};
  quiz.questions.forEach((qid, qi) => {
    const item = getBankItem(qid);
    if (!item) return;
    if (item.type === 'mcq-single' || item.type === 'mcq-multi') {
      const opts = item.options.map((_, i) => i);
      optionOrders[qi] = shuffle(opts, attemptIdSeed + qi);
    }
  });
  return { questionOrder, optionOrders };
}

/* grade a single answer against a question */
export function gradeAnswer(question, answer) {
  if (!question || answer == null) return { correct: false, pointsEarned: 0, status: 'auto' };
  switch (question.type) {
    case 'mcq-single':
      return answer.index === question.correctIndex
        ? { correct: true, pointsEarned: question.points, status: 'auto' }
        : { correct: false, pointsEarned: 0, status: 'auto' };
    case 'mcq-multi':
      return { correct: false, pointsEarned: 0, status: 'auto' };
    case 'tf':
      return answer.value === question.correct
        ? { correct: true, pointsEarned: question.points, status: 'auto' }
        : { correct: false, pointsEarned: 0, status: 'auto' };
    case 'short': {
      const text = String(answer.value || '').trim().toLowerCase();
      const accepted = (question.acceptableAnswers || []).map((a) => a.toLowerCase());
      return accepted.includes(text)
        ? { correct: true, pointsEarned: question.points, status: 'auto' }
        : { correct: false, pointsEarned: 0, status: 'auto' };
    }
    case 'essay':
      return {
        correct: null,
        pointsEarned: 0,
        status: 'manual_pending',
        feedback: 'Awaiting instructor review.',
      };
    default:
      return { correct: false, pointsEarned: 0, status: 'auto' };
  }
}

/* Run the entire grading pass for an attempt */
export function gradeAttempt(quiz, answers) {
  const grading = {};
  let total = 0;
  let pendingManual = 0;
  quiz.questions.forEach((qid, idx) => {
    const item = getBankItem(qid);
    if (!item) return;
    const result = gradeAnswer(item, answers[qid]);
    grading[idx] = { ...result, points: item.points };
    total += result.pointsEarned || 0;
    if (result.status === 'manual_pending') pendingManual++;
  });
  const maxScore = quiz.questions.reduce((s, qid) => s + (getBankItem(qid)?.points || 1), 0);
  const passed = total / maxScore * 100 >= (quiz.rules?.passingScore || 50);
  return { total, maxScore, grading, passed, pendingManual };
}