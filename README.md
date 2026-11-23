# Brightwell Academy

A responsive e-learning platform demo for learner, instructor, and administrator workflows. It is built with React and Vite and stores demo account and quiz data in browser localStorage.

## Overview

Brightwell Academy combines a public course catalogue with role-specific dashboards. The interface demonstrates course discovery, lesson viewing, quiz authoring, grading, analytics, account management, and learner progress tracking.

## Features

### Public site

- Landing page
- Course catalogue and course details
- About page

### Learner portal

- Dashboard and enrolled courses
- Lesson player
- Quiz history and achievements
- Deadlines and calendar
- Course catalogue and account settings

### Instructor portal

- Course dashboard
- Quiz authoring wizard
- Reusable question bank
- Manual grading queue
- Quiz analytics and item analysis
- Gradebook and student management
- Account settings

### Administrator portal

- Platform overview
- Course catalogue
- User and payment summaries

### Quiz capabilities

- Multiple-choice, true/false, short-answer, and essay questions
- Question and answer shuffling
- Focus-loss and paste detection
- Timed quiz rules and time-bank controls
- Integrity flags
- Rubric-style manual grading
- Grade-distribution and problem-question analysis

## Tech Stack

- React 18
- React Router
- Vite 5
- Tailwind CSS 4
- Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local address printed by Vite, usually `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

## Demo Accounts

| Role | Username | Password |
|---|---|---|
| Learner | `student` | `student123` |
| Instructor | `teacher` | `teacher123` |
| Administrator | `admin` | `admin123` |

A new learner account can also be created through the demo sign-up flow.

## Data and Security Notes

- Demo data is persisted in browser `localStorage`.
- Demo passwords are processed using SHA-256 for this frontend prototype.
- This repository does not provide production authentication, authorization, database security, or anti-cheating guarantees.
- Do not use the demo credentials or localStorage implementation for real educational records or sensitive data.

## Project Structure

```text
.
├── public/          # Public static assets
├── src/             # Application components and role-specific views
├── index.html       # HTML entry point
├── package.json     # Scripts and dependencies
└── vite.config.js   # Vite configuration
```

## Deployment

Run `npm run build` and deploy the generated `dist/` directory to Vercel, Netlify, GitHub Pages, or another static hosting provider.

## License

No license has been specified for this repository.
