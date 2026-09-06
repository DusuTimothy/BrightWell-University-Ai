import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, Icon, Section } from '../../components/ui/Kit.jsx';
import { brand } from '../../data/seed.js';

const CONTACTS = [
  { icon: 'map-pin', title: 'Visit us', lines: [brand.address, 'Open to visitors 09:00 – 17:00, Mon–Sat'] },
  { icon: 'phone', title: 'Telephone', lines: [brand.phone, 'Switchboard open 08:00 – 20:00'] },
  { icon: 'mail', title: 'Email', lines: [brand.email, 'We reply within two working days'] },
];

const DEPARTMENTS = [
  ['Admissions', 'admissions@brightwell.ng', '+234 1 280 4701'],
  ['Communications and media', 'press@brightwell.ng', '+234 1 280 4702'],
  ['Careers service', 'careers@brightwell.ng', '+234 1 280 4703'],
  ['Visiting researcher enquiries', 'visitors@brightwell.ng', '+234 1 280 4704'],
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', topic: 'Admissions', message: '' });

  function submit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageHeader
        title="Contact us"
        lead="Any questions? Our team will point you to the right person — or tell you where to find the answer yourself."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Contact' }]}
      />

      <Section>
        <div className="c-container grid grid-cols-12 gap-8">
          <div className="col-span-full lg:col-span-5">
            <div className="space-y-5">
              {CONTACTS.map((c) => (
                <div key={c.title} className="flex items-start gap-4 rounded-xl bg-paper p-6 ring-1 ring-line">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-cyan">
                    <Icon name={c.icon} className="c-icon--md" />
                  </span>
                  <div>
                    <h3 className="h5 text-heading">{c.title}</h3>
                    {c.lines.map((l) => (
                      <p key={l} className="mt-1 text-sm text-body">
                        {l}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-band p-6">
              <h3 className="h4 mb-3 text-heading">Department directory</h3>
              <ul className="divide-y divide-line/70">
                {DEPARTMENTS.map(([name, email, phone]) => (
                  <li key={name} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span className="font-medium text-heading">{name}</span>
                    <span className="text-xs text-body/80">
                      {email} · {phone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-full lg:col-span-7">
            <div className="rounded-xl bg-paper p-8 ring-1 ring-line">
              <h2 className="h2 text-heading">Send us a message</h2>
              {sent ? (
                <div className="mt-6 rounded-lg bg-band p-8 text-center">
                  <p className="h4 text-heading">Thank you — message sent</p>
                  <p className="mt-2 text-sm text-body">In a real deployment this would be posted to our team. We’ll be in touch within two working days.</p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-6 grid grid-cols-2 gap-4">
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Full name</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Email address</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm">
                    <span className="mb-1 block font-medium text-heading">Topic</span>
                    <select
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    >
                      {['Admissions', 'Undergraduate', 'Graduate', 'Research collaboration', 'Visiting', 'Careers', 'Media', 'Other'].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </label>
                  <label className="col-span-2 block text-sm">
                    <span className="mb-1 block font-medium text-heading">Message</span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <div className="col-span-2">
                    <Button>Send message</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}