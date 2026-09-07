import React from 'react';

export default function SignupStepper({ current }) {
  const steps = [
    { n: 1, label: 'Identity' },
    { n: 2, label: 'About you' },
    { n: 3, label: 'Make it yours' },
  ];
  return (
    <ol className="flex items-center gap-3" aria-label="Sign up progress">
      {steps.map((s, i) => (
        <li key={s.n} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={
                'grid size-8 place-items-center rounded-full text-xs font-bold transition-colors ' +
                (current > s.n
                  ? 'bg-emerald-500 text-white'
                  : current === s.n
                  ? 'bg-accent text-white shadow'
                  : 'bg-band text-body/60')
              }
              aria-current={current === s.n ? 'step' : undefined}
            >
              {current > s.n ? '✓' : s.n}
            </span>
            <span className={'text-xs font-semibold ' + (current === s.n ? 'text-heading' : 'text-body/60')}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && <span className="hidden h-px w-8 bg-line sm:block" aria-hidden />}
        </li>
      ))}
    </ol>
  );
}