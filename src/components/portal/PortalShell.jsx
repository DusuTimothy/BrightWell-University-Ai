import React, { useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Kit.jsx';
import { getPortalUser, logoutPortal, ROLE_HOMES, ROLE_LABELS } from '../../lib/portalAuth.js';
import { brand } from '../../data/seed.js';
import { NAV_GROUPS } from '../../data/navigation.js';
import cn from '../../lib/cn.js';
import { RoleBadge } from './PortalKit.jsx';

function SidebarLink({ item, onNavigate }) {
  return (
    <li className="relative">
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isActive
              ? 'bg-white/10 text-white'
              : 'text-white/65 hover:bg-white/5 hover:text-white'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <span className="absolute -left-3 top-1.5 bottom-1.5 w-0.5 rounded-r bg-cyan" aria-hidden />}
            <Icon name={item.icon} className="c-icon--sm shrink-0 fill-cyan/70" />
            <span className="flex-1">{item.label}</span>
            {item.badge != null && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

function SidebarGroup({ group }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
        {group.section}
      </p>
      <ul className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <SidebarLink key={item.to} item={item} />
        ))}
      </ul>
    </div>
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

  const groups = NAV_GROUPS[role] || [];

  function logout() {
    logoutPortal();
    navigate('/portal/login');
  }

  return (
    <div className="min-h-screen bg-off-white-50">
      {/* ---------- mobile top bar ---------- */}
      <div className="lg:hidden">
        <div className="dark flex items-center justify-between bg-brand px-4 py-3 text-white">
          <Link to="/" className="flex items-center gap-2">
            <img src="/crest.svg" alt="" width="30" height="30" />
            <span className="font-heading text-sm">{brand.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <RoleBadge role={role} />
            <button
              type="button"
              aria-label="Toggle menu"
              className="grid size-9 place-items-center rounded-md bg-white/10"
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? 'cross' : 'menu'} className="c-icon--sm fill-cyan" />
            </button>
          </div>
        </div>
        {open && (
          <nav className="dark max-h-[70vh] overflow-y-auto bg-brand px-3 pb-4 text-white">
            {groups.map((g) => <SidebarGroup key={g.section} group={g} />)}
            <MobileIdentity user={user} onLogout={logout} />
          </nav>
        )}
      </div>

      {/* ---------- desktop shell ---------- */}
      <div className="lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="dark sticky top-0 hidden h-screen flex-col overflow-y-auto bg-brand py-6 text-white lg:flex">
          <div className="px-5">
            <Link to="/" className="flex items-center gap-3">
              <img src="/crest.svg" alt="" width="40" height="40" />
              <div>
                <p className="font-heading text-base leading-tight text-heading">{brand.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-cyan">Learner portal</p>
              </div>
            </Link>
          </div>

          <div className="mt-5 px-5">
            <RoleBadge role={role} />
          </div>

          <nav className="mt-5 flex-1 overflow-y-auto px-3" aria-label={`${ROLE_LABELS[role]} navigation`}>
            {groups.map((g) => <SidebarGroup key={g.section} group={g} />)}
          </nav>

          <div className="mx-3 mt-3 rounded-lg bg-white/5 p-4">
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
              <RoleBadge role={role} />
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

function MobileIdentity({ user, onLogout }) {
  return (
    <div className="mt-4 rounded-lg bg-white/5 p-4">
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
        <button type="button" onClick={onLogout} className="text-xs font-medium text-white/70 hover:text-white">
          Sign out
        </button>
      </div>
    </div>
  );
}