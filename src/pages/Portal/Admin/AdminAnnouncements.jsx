import React, { useState } from 'react';
import { Icon } from '../../../components/ui/Kit.jsx';
import { PageHeading, Card } from '../../../components/portal/PortalKit.jsx';
import { AnnouncementsList } from '../../../components/portal/PortalBits.jsx';
import { announcements as seed } from '../../../data/school.js';

const AUDIENCES = ['All', 'Staff', 'Parents', 'Students'];

export default function AdminAnnouncements() {
  const [items, setItems] = useState(seed);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('All');
  const [sent, setSent] = useState('');

  function publish(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    setItems([{ id: 'A' + Date.now(), date: today, audience, title: title.trim(), body: body.trim() }, ...items]);
    setTitle('');
    setBody('');
    setAudience('All');
    setSent('Announcement published to the portal.');
    setTimeout(() => setSent(''), 4000);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Announcements" subtitle="Broadcast news to the whole school or a single audience" />

      <Card>
        <h3 className="h4 mb-1 text-heading">Publish a new announcement</h3>
        <p className="mb-4 text-sm text-body">It appears instantly on the admin, student and teacher portals.</p>
        <form onSubmit={publish} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="rounded-md border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-md border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent">
              {AUDIENCES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write the announcement body…"
            rows={3}
            className="rounded-md border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <div className="flex items-center gap-3">
            <button type="submit" className="rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand">
              Publish
            </button>
            {sent && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Icon name="check-circle" className="c-icon--sm" />
                {sent}
              </span>
            )}
          </div>
        </form>
      </Card>

      <AnnouncementsList items={items} />
    </div>
  );
}