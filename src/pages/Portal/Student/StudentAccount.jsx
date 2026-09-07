import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getPortalUser, logoutPortal } from '../../../lib/portalAuth.js';
import { useNavigate } from 'react-router-dom';

export default function StudentAccount({ title }) {
  const user = getPortalUser();
  const navigate = useNavigate();

  function logout() {
    logoutPortal();
    navigate('/portal/login');
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title={title || 'Profile'} subtitle="Account & preferences." />

      <Card>
        <div className="flex items-center gap-4">
          <span
            className="grid size-14 place-items-center rounded-full font-heading text-lg text-white"
            style={{ background: avatarColor(user.avatar) }}
          >
            {user.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </span>
          <div className="flex-1">
            <p className="text-base font-semibold text-heading">{user.name}</p>
            <p className="text-sm text-body">{user.email}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge tone="cyan">{user.title}</Badge>
              <Badge tone="muted">ID {user.id}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="h4 mb-3 text-heading">Quick links</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <Link to="/portal/student/account/notifications" className="flex items-center justify-between rounded-lg bg-band/40 p-3 text-sm font-medium">
              <span className="flex items-center gap-2"><Icon name="bell" className="c-icon--sm fill-accent" /> Notification settings</span>
              <Icon name="chevron-right" className="c-icon--xs" />
            </Link>
          </li>
          <li>
            <Link to="/portal/student/account/help" className="flex items-center justify-between rounded-lg bg-band/40 p-3 text-sm font-medium">
              <span className="flex items-center gap-2"><Icon name="life-buoy" className="c-icon--sm fill-accent" /> Help & support</span>
              <Icon name="chevron-right" className="c-icon--xs" />
            </Link>
          </li>
        </ul>
        <div className="mt-4 border-t border-line pt-4">
          <button type="button" onClick={logout} className="text-sm font-semibold text-red-600 hover:underline">
            Sign out
          </button>
        </div>
      </Card>
    </div>
  );
}

function avatarColor(avatar) {
  return {
    indigo: '#1d42a6',
    slate:  '#475569',
    sand:   '#a98a5b',
    mint:   '#0d9488',
  }[avatar] || '#1d42a6';
}