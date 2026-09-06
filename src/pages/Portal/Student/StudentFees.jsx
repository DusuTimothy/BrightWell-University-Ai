import React from 'react';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { fmtNaira } from '../../../components/portal/PortalBits.jsx';
import { students, feesFor, school } from '../../../data/school.js';

export default function StudentFees() {
  const user = getPortalUser();
  const me = students.find((s) => s.id === user.id) || students[3];
  const fee = feesFor(me.id);
  const pct = Math.round((fee.paid / fee.fee) * 100);
  const tone = fee.balance === 0 ? 'success' : pct >= 60 ? 'cyan' : 'warn';

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Fees &amp; payments" subtitle={`${me.name} · ${school.academicYear} ${school.term}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="h4 mb-1 text-heading">Tuition summary</h3>
          <p className="mb-4 text-sm text-body">{fee.term} · daily sessions, laboratory and library levy included</p>
          <div className="grid grid-cols-3 gap-3 pb-4 text-center">
            <div className="rounded-lg bg-off-white-50 p-4">
              <p className="text-xs text-body">Term fee</p>
              <p className="mt-1 font-heading text-xl text-heading">{fmtNaira(fee.fee)}</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs text-emerald-700">Paid</p>
              <p className="mt-1 font-heading text-xl text-emerald-700">{fmtNaira(fee.paid)}</p>
            </div>
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-xs text-amber-700">Balance</p>
              <p className="mt-1 font-heading text-xl text-amber-700">{fmtNaira(fee.balance)}</p>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-body">Payment progress</span>
              <span className="font-semibold text-heading">{pct}%</span>
            </div>
            <Bar pct={pct} tone={tone} />
          </div>
          <div className="mt-4">
            <Badge tone={tone}>{fee.balance === 0 ? 'Paid in full — thank you!' : 'Balance outstanding'}</Badge>
          </div>
        </Card>

        <Card>
          <h3 className="h4 mb-3 text-heading">How to pay</h3>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-body">
            <li>Log in with your guardian&apos;s account or visit the school bursary.</li>
            <li>Bank transfer to Brightwell&apos;s account using your student ID as reference.</li>
            <li>The balance here updates within two working days.</li>
          </ol>
          <p className="mt-4 rounded-lg bg-band/50 px-3 py-2 text-xs text-body">
            Need a payment plan? Email <span className="font-medium text-accent">bursar@brightwell.ng</span>.
          </p>
        </Card>
      </div>
    </div>
  );
}