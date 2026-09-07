import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses } from '../../../data/learning.js';

export default function StudentWishlist() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Wishlist" subtitle="Courses you're considering — enrol when you're ready." />
      <Card>
        <div className="py-12 text-center">
          <Icon name="heart" className="c-icon--md mx-auto fill-body/40" />
          <p className="h4 mt-3 text-heading">Save courses to your wishlist</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-body">
            Tap the heart icon on any course in the catalogue to save it here for later.
          </p>
          <Link to="/portal/student/browse" className="mt-4 inline-flex c-button c-button--primary !py-2.5">
            Browse catalogue
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        </div>
      </Card>
    </div>
  );
}