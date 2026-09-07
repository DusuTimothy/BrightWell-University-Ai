import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, coursesByBranch, getLearningBranch, setLearningBranch } from '../../../data/learning.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import {
  listMethods, addMethod, removeMethod, setDefaultMethod,
  issueOtp, verifyOtp,
} from '../../../data/billing.js';
import cn from '../../../lib/cn.js';

const FEE_BY_BRANCH = {
  secondary: 38500,
  university: 75000,
};

export default function StudentEnrol() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const user = getPortalUser();
  const course = getLearningCourse(slug);

  const [methods, setMethods] = useState(listMethods());
  const [selectedId, setSelectedId] = useState(() => listMethods().find((m) => m.isDefault)?.id || null);
  const [step, setStep] = useState('choose'); // 'choose' | 'add-card' | 'verify' | 'done'
  const [otp, setOtp] = useState('');
  const [issuedOtp, setIssuedOtp] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!course) return <Navigate to="/portal/student/browse" replace />;

  const fee = FEE_BY_BRANCH[course.branch] ?? 50000;

  function refreshMethods() {
    const m = listMethods();
    setMethods(m);
    setSelectedId((cur) => cur && m.some((x) => x.id === cur) ? cur : (m.find((x) => x.isDefault)?.id || m[0]?.id || null));
  }

  function startAdd() {
    setError('');
    setStep('add-card');
  }

  function saveCard(e) {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      const method = addMethod({
        pan: form.get('pan'),
        holder: form.get('holder'),
        expiry: form.get('expiry'),
        brand: form.get('brand') || 'Visa',
      });
      refreshMethods();
      setSelectedId(method.id);
      requestOtp(method.id);
    } catch (err) {
      setError(err.message);
    }
  }

  function requestOtp(methodId) {
    const code = issueOtp(methodId);
    setIssuedOtp(code);
    setOtp('');
    setError('');
    setStep('verify');
  }

  function confirmPayment(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      verifyOtp(otp, selectedId);
      setBusy(false);
      setStep('done');
    } catch (err) {
      setBusy(false);
      setError(err.message);
    }
  }

  function removeCard(id) {
    if (!confirm('Remove this card?')) return;
    removeMethod(id);
    refreshMethods();
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col gap-6">
        <PageHeading
          title="You're enrolled!"
          subtitle={`Welcome to ${course.title}.`}
        />
        <Card className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <Icon name="check-circle" className="c-icon--md fill-emerald-600" />
          </span>
          <p className="h3 mt-4 text-heading">Payment confirmed</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-body">
            ₦{fee.toLocaleString()} charged to the selected card. Receipt sent to your email. You can start learning right away.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link to={`/portal/student/courses/${course.slug}`} className="c-button c-button--primary !py-2.5">
              Start learning
              <Icon name="arrow" className="c-icon--sm" />
            </Link>
            <Link to="/portal/student/courses" className="c-button c-button--secondary !py-2.5">
              My courses
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to={`/courses/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        Back to course
      </Link>

      <PageHeading
        title="Enrol & pay"
        subtitle={`Secure checkout for ${course.title}.`}
        actions={<Badge tone="cyan">Demo mode</Badge>}
      />

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {/* Course summary */}
          <Card className="mb-4 flex items-center gap-4">
            <img src={course.img} alt="" className="h-16 w-24 shrink-0 rounded object-cover" />
            <div className="flex-1">
              <p className="h5 text-heading">{course.title}</p>
              <p className="text-xs text-body/70">{course.subject} · {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons</p>
            </div>
            <div className="text-right">
              <p className="font-heading text-2xl text-heading">₦{fee.toLocaleString()}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">One-time</p>
            </div>
          </Card>

          {step === 'choose' && (
            <Card>
              <h3 className="h4 mb-3 text-heading">How would you like to pay?</h3>

              {methods.length === 0 ? (
                <div className="rounded-lg bg-band/40 p-4 text-sm text-body">
                  <p className="font-medium text-heading">No saved cards yet</p>
                  <p className="mt-1 text-xs">Add a card now — your details are tokenised and we only ask for an OTP next time.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {methods.map((m) => (
                    <li key={m.id}>
                      <label
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-sm border-2 p-3 transition-colors',
                          selectedId === m.id ? 'border-accent bg-accent/5' : 'border-line bg-paper hover:border-accent/60'
                        )}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={m.id}
                          checked={selectedId === m.id}
                          onChange={() => setSelectedId(m.id)}
                          className="size-4 accent-[#1d42a6]"
                        />
                        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-band text-accent">
                          <Icon name="credit-card" className="c-icon--sm" />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-heading">{m.brand} ···· {m.last4}</span>
                          <span className="block text-xs text-body/80">{m.holder} · expires {m.expiry}</span>
                        </span>
                        {m.isDefault && <Badge tone="success">Default</Badge>}
                        {!m.isDefault && (
                          <button type="button" onClick={(e) => { e.preventDefault(); setDefaultMethod(m.id); refreshMethods(); }} className="text-xs text-accent hover:underline">
                            Set default
                          </button>
                        )}
                        <button type="button" onClick={(e) => { e.preventDefault(); removeCard(m.id); }} aria-label="Remove card" className="grid size-7 place-items-center rounded-md text-body hover:bg-red-50 hover:text-red-600">
                          <Icon name="cross" className="c-icon--sm" />
                        </button>
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <button type="button" onClick={startAdd} className="text-sm font-semibold text-accent hover:underline">
                  + Add a new card
                </button>
                <div className="flex gap-2">
                  <Link to={`/courses/${course.slug}`} className="c-button c-button--secondary !py-2.5">
                    Cancel
                  </Link>
                  <button
                    type="button"
                    disabled={!selectedId}
                    onClick={() => requestOtp(selectedId)}
                    className="c-button c-button--primary !py-2.5 disabled:opacity-40"
                  >
                    Pay ₦{fee.toLocaleString()}
                    <Icon name="arrow" className="c-icon--sm" />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {step === 'add-card' && (
            <Card>
              <h3 className="h4 mb-1 text-heading">Add a card</h3>
              <p className="mb-4 text-sm text-body">
                Your card is tokenised before storage. We never persist the full PAN.
              </p>
              <form onSubmit={saveCard} className="flex flex-col gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Card number</span>
                  <input
                    name="pan"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    required
                    className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Cardholder name</span>
                  <input
                    name="holder"
                    type="text"
                    autoComplete="cc-name"
                    placeholder="Chidinma Okafor"
                    required
                    className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Expiry (MM/YY)</span>
                    <input
                      name="expiry"
                      type="text"
                      autoComplete="cc-exp"
                      placeholder="12/29"
                      maxLength={5}
                      required
                      className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm font-mono outline-none focus:border-accent"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">Brand</span>
                    <select
                      name="brand"
                      className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
                      defaultValue="Visa"
                    >
                      <option>Visa</option>
                      <option>Mastercard</option>
                      <option>Verve</option>
                    </select>
                  </label>
                </div>
                {error && (
                  <p role="alert" className="rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
                    {error}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setStep('choose')} className="c-button c-button--secondary !py-2.5">
                    Back
                  </button>
                  <button type="submit" className="c-button c-button--primary !py-2.5">
                    Save card
                    <Icon name="arrow" className="c-icon--sm" />
                  </button>
                </div>
              </form>
            </Card>
          )}

          {step === 'verify' && (
            <Card>
              <h3 className="h4 mb-1 text-heading">Enter the 6-digit code</h3>
              <p className="mb-4 text-sm text-body">
                We sent a one-time code to confirm this payment. The same card will be used.
              </p>

              <div className="mb-4 flex items-center gap-3 rounded-lg bg-band/40 p-3">
                <Icon name="credit-card" className="c-icon--sm fill-accent" />
                <span className="flex-1 text-sm font-medium text-heading">
                  {methods.find((m) => m.id === selectedId)?.brand} ···· {methods.find((m) => m.id === selectedId)?.last4}
                </span>
                <button type="button" onClick={() => setStep('choose')} className="text-xs font-semibold text-accent hover:underline">
                  Change card
                </button>
              </div>

              <form onSubmit={confirmPayment} className="flex flex-col gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Verification code</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="······"
                    maxLength={6}
                    required
                    className="w-full rounded-sm border border-line bg-paper px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] outline-none focus:border-accent"
                  />
                </label>

                {error && (
                  <p role="alert" className="rounded-sm bg-red-50 px-3 py-2 text-sm font-medium text-red-600 ring-1 ring-red-100">
                    {error}
                  </p>
                )}

                {issuedOtp && (
                  <div className="rounded-sm bg-cyan/10 px-3 py-2 text-xs text-cyan-deep ring-1 ring-cyan/30">
                    <strong>Demo code:</strong> {issuedOtp} — copy this into the field above. (In production this is sent by SMS / authenticator.)
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => requestOtp(selectedId)} className="text-sm font-semibold text-accent hover:underline">
                    Resend code
                  </button>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setStep('choose')} className="c-button c-button--secondary !py-2.5">
                      Back
                    </button>
                    <button type="submit" disabled={busy || otp.length !== 6} className="c-button c-button--primary !py-2.5 disabled:opacity-40">
                      Confirm & pay
                      <Icon name="check-circle" className="c-icon--sm" />
                    </button>
                  </div>
                </div>
              </form>
            </Card>
          )}
        </div>

        <div className="lg:col-span-5">
          <Card className="sticky top-8">
            <h3 className="h5 text-heading">Order summary</h3>
            <dl className="mt-3 divide-y divide-line text-sm">
              <Row k="Course" v={course.title} />
              <Row k="Lessons" v={`${course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons`} />
              <Row k="Access" v="Lifetime (this term)" />
              <Row k="Branch" v={course.branch === 'university' ? 'University' : 'Secondary School'} />
              <div className="flex items-center justify-between py-3">
                <dt className="font-semibold text-heading">Total</dt>
                <dd className="font-heading text-2xl text-heading">₦{fee.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="mt-3 rounded-sm bg-band/40 p-3 text-xs leading-relaxed text-body">
              <strong className="block text-heading">Demo payment</strong>
              Use any 16-digit number, any cardholder, any future MM/YY. The "OTP" we issue is shown above — paste it back to confirm.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between gap-2 py-3">
      <dt className="text-body/80">{k}</dt>
      <dd className="text-right font-medium text-heading">{v}</dd>
    </div>
  );
}