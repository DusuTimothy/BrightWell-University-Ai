import React, { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Kit.jsx';
import { getPortalUser, logoutPortal, ROLE_HOMES, ROLE_LABELS } from '../../lib/portalAuth.js';
import { school } from '../../data/school.js';
import cn from '../../lib/cn.js';
import { RoleBadge } from './PortalKit.jsx';

const NAV = {
  admin: [
    { to: '/portal/admin', label: 'Dashboard', icon: 'bank', end: true },
    { to: '/portal/admin/students', label: 'Students', icon: 'users' },
    { to: '/portal/admin/staff', label: 'Staff', icon: 'badge' },
    { to: '/portal/admin/classes', label: 'Classes', icon: 'building' },
    { to: '/portal/admin/timetable', label: 'Timetable', icon: 'calendar-clock' },
    { to: '/portal/admin/grades', label: 'Grades', icon: 'award' },
    { to: '/portal/admin/fees', label: 'Fees & payments', icon: 'naira' },
    { to: '/portal/admin/announcements', label: 'Announcements', icon: 'megaphone' },
  ],
  teacher: [
    { to: '/portal/teacher', label: 'Dashboard', icon: 'bank', end: true },
    { to: '/portal/teacher/classes', label: 'My classes', icon: 'building' },
    { to: '/portal/teacher/gradebook', label: 'Gradebook', icon: 'award' },
    { to: '/portal/teacher/timetable', label: 'Timetable', icon: 'calendar-clock' },
    { to: '/portal/teacher/announcements', label: 'Announcements', icon: 'megaphone' },
  ],
  student: [
    { to: '/portal/student', label: 'Dashboard', icon: 'bank', end: true },
    { to: '/portal/student/results', label: 'My results', icon: 'award' },
    { to: '/portal/student/timetable', label: 'My timetable', icon: 'calendar-clock' },
    { to: '/portal/student/fees', label: 'Fees & payments', icon: 'naira' },
    { to: '/portal/student/announcements', label: 'Announcements', icon: 'megaphone' },
  ],
};

function SidebarLink({ item, onNavigate }) {
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
            isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
          )
        }
      >
        <Icon name={item.icon} className="c-icon--sm fill-cyan/70" />
        {item.label}
      </NavLink>
    </li>
  );
}

export default function PortalShell({ role }) {
  const user = getPortalUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (!user) return <Navigate to="/portal/login" replace />;
  if (user.role !== role) return <Navigate to={ROLE_HOMES[user.role] || '/portal/login'} replace />;

  const links = NAV[role] || [];

  function logout() {
    logoutPortal();
    navigate('/portal/login');
  }

  return (
    <div className="min-h-screen bg-off-white-50">
      {/* ---------- mobile top bar ---------- */}
      <div className="lg:hidden">
        <div className="dark flex items-center justify-between bg-brand px-4 py-3 text-white">
          <Link to="/portal" className="flex items-center gap-2">
            <img src="/crest.svg" alt="" width="30" height="30" />
            <span className="font-heading text-sm">{school.short}</span>
          </Link>
          <div className="flex items-center gap-2">
            <RoleBadge role={role} />
            <button type="button" aria-label="Toggle menu" className="grid size-9 place-items-center rounded-md bg-white/10" onClick={() => setOpen(!open)}>
              <Icon name="menu" className="c-icon--sm fill-cyan" />
            </button>
          </div>
        </div>
        {open && <PortalNav links={links} onNavigate={() => setOpen(false)} />}
      </div>

      {/* ---------- desktop shell ---------- */}
      <div className="lg:grid lg:grid-cols-[16.5rem_1fr]">
        <aside className="dark sticky top-0 hidden h-screen flex-col bg-brand py-6 text-white lg:flex">
          <div className="px-5">
            <Link to="/portal" className="flex items-center gap-3">
              <img src="/crest.svg" alt="" width="44" height="44" />
              <div>
                <p className="font-heading text-base leading-tight text-heading">{school.short}</p>
                <p className="text-[10px] uppercase tracking-widest text-cyan">Portal</p>
              </div>
            </Link>
          </div>

          <nav className="mt-8 flex-1 overflow-y-auto px-3">
            <ul className="flex flex-col gap-1">
              {links.map((item) => (
                <SidebarLink key={item.to} item={item} />
              ))}
            </ul>
          </nav>

          <div className="mx-3 rounded-lg bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-accent font-heading text-sm text-white">
                {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.name}</p>
                <p className="truncate text-xs text-white/60">{user.title}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <Link to="/" className="text-xs text-cyan hover:text-white">
                View website
              </Link>
              <button type="button" onClick={logout} className="text-xs font-medium text-white/70 hover:text-white">
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="min-h-screen px-4 py-6 md:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 hidden items-center justify-between lg:flex">
              <div className="flex items-center gap-3">
                <RoleBadge role={role} />
                <span className="text-xs text-body">{school.name} · {school.academicYear} · {school.term}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-body">
                <Link to="/" className="hover:text-accent">
                  View website
                </Link>
                <button type="button" onClick={logout} className="font-medium text-accent hover:underline">
                  Sign out
                </button>
              </div>
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function PortalNav({ links, onNavigate }) {
  return (
    <nav className="dark bg-brand px-3 pb-4">
      <ul className="flex flex-col gap-1">
        {links.map((item) => (
          <SidebarLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </ul>
    </nav>
  );
}