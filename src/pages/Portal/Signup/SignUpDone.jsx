import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '../../../components/ui/Kit.jsx';
import { brand } from '../../../data/seed.js';
import { ROLE_HOMES } from '../../../lib/portalAuth.js';

export default function SignUpDone() {
  const location = useLocation();
  const state = location.state || {};
  const name = state.name || 'there';
  const role = state.role || 'student';
  const avatar = state.avatar || 'indigo';

  const home = ROLE_HOMES[role] || '/portal/student';

  return (
    <div className="dark relative min-h-screen overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute left-0 top-[-10%] -translate-y-[5%] opacity-90">
        <img src="/crest.svg" alt="" className="watermark w-[42rem] max-w-none" />
      </div>
      <div className="c-container relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-cyan shadow-[0_0_0_2px_rgba(38,210,255,0.35)]" aria-hidden>
              <img src="/crest.svg" alt="" width="28" height="28" className="h-7 w-auto" />
            </span>
            <div>
              <p className="font-heading text-base font-semibold leading-tight text-cyan tracking-tight">{brand.name}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/75">Welcome</p>
            </div>
          </Link>
        </header>

        <div className="mx-auto w-full max-w-2xl flex-1 py-8">
          <div className="rounded-2xl bg-white p-8 text-center text-royal shadow-2xl ring-1 ring-white/20 md:p-12">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-cyan/15 text-cyan-deep">
              <Icon name="check-circle" className="c-icon--md fill-cyan-deep" />
            </div>
            <h1 className="h2 mt-5 text-heading">You're in, {name.split(' ')[0]}.</h1>
            <p className="mt-2 text-sm text-body">
              Your {role} workspace is ready. We've pre-seeded a few courses to get you started.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <Stat label="Courses" value="3" sub="pre-enrolled" />
              <Stat label="Lessons" value="0" sub="completed" />
              <Stat label="Quizzes" value="0" sub="taken" />
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to={home} className="c-button c-button--primary">
                Go to my dashboard
                <Icon name="arrow" className="c-icon--sm" />
              </Link>
              <Link to="/courses" className="c-button c-button--secondary">
                Browse courses
              </Link>
            </div>
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {brand.name}
        </footer>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="rounded-xl bg-band/50 p-4">
      <p className="font-heading text-2xl text-heading">{value}</p>
      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">{label}</p>
      <p className="mt-1 text-xs text-body/70">{sub}</p>
    </div>
  );
}