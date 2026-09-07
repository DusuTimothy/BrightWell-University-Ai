import React from 'react';
import { Button, Section } from '../../components/ui/Kit.jsx';

export default function NotFoundPage() {
  return (
    <>
      <section className="dark relative overflow-hidden bg-brand text-white">
        <div aria-hidden className="absolute inset-0 hero-grid-bg" />
        <div className="c-container relative py-20 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan">Error 404</p>
          <h1 className="h1 mt-2 max-w-[16ch] text-heading">This page could not be found</h1>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-navy-body">
            The page may have moved, or the address may be misspelled. Try searching, or start again from the homepage.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/">Back to the homepage</Button>
            <Button variant="secondary" to="/courses">
              Browse courses
            </Button>
          </div>
        </div>
      </section>
      <Section>
        <div className="c-container text-center text-sm text-body">If you believe this is our mistake, please contact the web team.</div>
      </Section>
    </>
  );
}