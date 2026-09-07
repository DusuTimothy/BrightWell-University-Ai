# Brightwell Academy — e-learning platform

A focused online learning platform with video lessons, quizzes and assignments for
self-paced study across secondary school and university levels.

## What's inside

- **Public site** — landing page, course catalogue, course detail, about page.
- **Learner portal** — dashboard, enrolled courses, lesson player, quiz history, deadlines, calendar, achievements, browse catalogue, account.
- **Instructor portal** — dashboard, courses, **quizzes**, **question bank**, **manual grading queue**, **quiz analytics**, gradebook, students, settings.
- **Administrator portal** — platform overview, course catalogue, user & payments overview.

### Highlights

- **Hierarchical sidebar nav** for all three roles with section headers.
- **Quiz authoring** with a 4-step wizard (Basics → Rules → Availability → Review).
- **Question Bank** with reusable MCQ, true/false, short-answer, and essay questions.
- **Anti-cheat mechanics** — question/answer shuffling, focus-loss detection, paste blocking, time bank, integrity flagging.
- **Manual grading queue** for essay questions with rubric scoring and reviewer comments.
- **Quiz analytics** with grade-distribution curve and *item analysis* that flags "problem questions" (⚠ Hard < 50%, 🚩 Review < 30% with negative discrimination).
- **Demo sign-up** — evaluators can create new accounts via a 3-step wizard; passwords hashed with SHA-256, all data persists in localStorage.

## Run locally

```bash
npm install
npm run dev
```

## Demo accounts

The portal uses three pre-set demo accounts (see the login screen):

| Role          | Username   | Password     |
|---------------|------------|--------------|
| Learner       | `student`  | `student123` |
| Instructor    | `teacher`  | `teacher123` |
| Administrator | `admin`    | `admin123`   |

Or create a new account via the **Create account** tab on the login page.