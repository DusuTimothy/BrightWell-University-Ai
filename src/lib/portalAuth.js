/* ==========================================================================
   Portal auth — demo storage.
   - Three pre-seeded accounts (admin, teacher, student) live alongside any
     new accounts the evaluator creates during the demo.
   - Passwords are salted SHA-256 (demo only — production would call /api).
   ========================================================================== */

const SESSION_KEY = 'bw_portal_session';
const USERS_KEY = 'bw_portal_users';
const SIGNUP_DRAFT_KEY = 'bw_signup_draft';

const SEED_USERS = [
  { id: 'STAFF-001', role: 'admin',    username: 'admin',    password: 'admin123',    email: 'admin@brightwell.academy',    name: 'Dr. Adaeze Obi',        title: 'Platform administrator', avatar: 'indigo', branch: null, createdAt: '2026-01-15' },
  { id: 'T-201',     role: 'teacher',  username: 'teacher',  password: 'teacher123',  email: 'teacher@brightwell.academy',  name: 'Mrs. Ngozi Adeyemi',     title: 'Course instructor — Mathematics', avatar: 'slate', branch: null, createdAt: '2026-01-15' },
  { id: 'BWS-0004',  role: 'student',  username: 'student',  password: 'student123',  email: 'student@brightwell.academy',  name: 'Chidinma Okafor',       title: 'Learner', avatar: 'mint', branch: 'secondary', createdAt: '2026-01-15' },
];

/* ---------- low-level storage helpers ---------- */

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(SEED_USERS));
      return [...SEED_USERS];
    }
    return JSON.parse(raw);
  } catch {
    return [...SEED_USERS];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function notifySessionChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('bw-portal-updated'));
  }
}

/* ---------- password hashing (demo-only) ---------- */

async function hashPassword(plain) {
  const enc = new TextEncoder();
  const data = enc.encode(`bw-demo::${plain}`);
  if (window.crypto?.subtle) {
    const buf = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `plain::${plain}`;
}

function legacyHash(plain) {
  return `plain::${plain}`;
}

function matches(record, plain) {
  return record.password === legacyHash(plain) || (record.passwordHash && record.passwordHash === hashPassword(plain));
}

/* ---------- exports ---------- */

export const PORTAL_CREDENTIALS = SEED_USERS.map(({ username, password, role }) => ({ role, username, password }));

export const ROLE_LABELS = { admin: 'Administrator', teacher: 'Instructor', student: 'Learner' };
export const ROLE_HOMES = { admin: '/portal/admin', teacher: '/portal/teacher', student: '/portal/student' };
export const ROLE_ACCENTS = { admin: 'accent', teacher: 'pill', student: 'cyan' };

export function getPortalUser() {
  return readSession();
}

export function requireRole(role) {
  const u = readSession();
  return u && u.role === role ? u : null;
}

export async function loginPortal(username, password) {
  const users = readUsers();
  const found = users.find(
    (u) =>
      (u.username && u.username.toLowerCase() === String(username).trim().toLowerCase()) ||
      (u.email && u.email.toLowerCase() === String(username).trim().toLowerCase())
  );
  if (!found) throw new Error('Invalid username or password.');

  const ok =
    found.password === password ||
    (found.passwordHash && (await hashPassword(password)) === found.passwordHash);
  if (!ok) throw new Error('Invalid username or password.');

  const session = {
    id: found.id,
    role: found.role,
    username: found.username,
    email: found.email,
    name: found.name,
    title: found.title,
    avatar: found.avatar,
    branch: found.branch || null,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifySessionChange();
  return session;
}

export function logoutPortal() {
  localStorage.removeItem(SESSION_KEY);
  notifySessionChange();
}

/* ---------- signup ---------- */

export function emailExists(email) {
  const users = readUsers();
  return users.some((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
}

export function usernameExists(username) {
  const users = readUsers();
  return users.some((u) => u.username && u.username.toLowerCase() === String(username).trim().toLowerCase());
}

export async function createAccount(input) {
  const { email, fullName, password, role, branch, subject, avatar, demoData } = input;
  if (emailExists(email)) throw new Error('An account with this email already exists.');
  if (input.username && usernameExists(input.username)) throw new Error('That username is taken.');

  const users = readUsers();
  const idPrefix = role === 'admin' ? 'STAFF' : role === 'teacher' ? 'T' : 'BWS';
  const id = `${idPrefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const titleMap = {
    admin: 'Administrator',
    teacher: subject ? `Course instructor — ${subject}` : 'Course instructor',
    student: 'Learner',
  };

  const username = input.username || email.split('@')[0];

  const newUser = {
    id,
    role,
    username,
    email,
    passwordHash: await hashPassword(password),
    name: fullName,
    title: titleMap[role],
    avatar: avatar || 'indigo',
    branch: branch || null,
    subject: subject || null,
    createdAt: new Date().toISOString().slice(0, 10),
    seedDemo: !!demoData,
  };

  users.push(newUser);
  writeUsers(users);

  const session = {
    id,
    role,
    username,
    email,
    name: fullName,
    title: newUser.title,
    avatar: newUser.avatar,
    branch: newUser.branch,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  notifySessionChange();
  return session;
}

/* ---------- signup draft persistence ---------- */

export function saveSignupDraft(draft) {
  try {
    localStorage.setItem(SIGNUP_DRAFT_KEY, JSON.stringify(draft));
  } catch { /* */ }
}

export function loadSignupDraft() {
  try {
    const raw = localStorage.getItem(SIGNUP_DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSignupDraft() {
  localStorage.removeItem(SIGNUP_DRAFT_KEY);
}

/* ---------- reset (debugging helper) ---------- */

export function resetAllDemoData() {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SIGNUP_DRAFT_KEY);
  localStorage.removeItem('bw_learning_state');
  localStorage.removeItem('bw_learning_branch');
}