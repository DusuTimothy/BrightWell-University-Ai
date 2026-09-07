import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card } from '../../components/portal/PortalKit.jsx';
import { Icon } from '../../components/ui/Kit.jsx';

export default function PlaceholderPage({ title, subtitle, icon = 'sparkles', back, cta }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeading title={title} subtitle={subtitle} />
      <Card>
        <div className="py-12 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-band text-accent">
            <Icon name={icon} className="c-icon--md" />
          </span>
          <p className="h4 mt-4 text-heading">This area is part of the navigation map</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-body">
            The route is wired up and the navigation works. The full screen for this area is part of a future release — wireframes are tracked in the product spec.
          </p>
          {(back || cta) && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {back && (
                <Link to={back.to} className="c-button c-button--secondary !py-2.5">
                  {back.label}
                </Link>
              )}
              {cta && (
                <Link to={cta.to} className="c-button c-button--primary !py-2.5">
                  {cta.label}
                  <Icon name="arrow" className="c-icon--sm" />
                </Link>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}