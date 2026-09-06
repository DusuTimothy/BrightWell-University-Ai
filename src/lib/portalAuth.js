const KEY = 'bw_portal_session';

export const PORTAL_CREDENTIALS = [
  { role: 'admin', username: 'admin', password: 'admin123', name: 'Dr. Adaeze Obi', title: 'School Principal', id: 'STAFF-001' },
  { role: 'teacher', username: 'teacher', password: 'teacher123', name: 'Mrs. Ngozi Adeyemi', title: 'Mathematics Teacher', id: 'T-201' },
  { role: 'student', username: 'student', password: 'student123', name: 'Chidinma Okafor', title: 'Senior Secondary 1 Student', id: 'BWS-0004' },
];

export const ROLE_LABELS = { admin: 'Administrator', teacher: 'Teacher', student: 'Student' };
export const ROLE_HOMES = { admin: '/portal/admin', teacher: '/portal/teacher', student: '/portal/student' };
export const ROLE_ACCENTS = { admin: 'accent', teacher: 'pill', student: 'cyan' };

function readSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getPortalUser() {
  return readSession();
}

export function requireRole(role) {
  const u = readSession();
  return u && u.role === role ? u : null;
}

export function loginPortal(username, password) {
  const found = PORTAL_CREDENTIALS.find(
    (c) => c.username.toLowerCase() === String(username).trim().toLowerCase() && c.password === password
  );
  if (!found) {
    throw new Error('Invalid username or password.');
  }
  const session = {
    role: found.role,
    username: found.username,
    name: found.name,
    title: found.title,
    id: found.id,
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logoutPortal() {
  localStorage.removeItem(KEY);
}