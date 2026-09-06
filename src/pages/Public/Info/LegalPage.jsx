import React from 'react';
import InfoPage from '../../../components/ui/InfoPage.jsx';

export default function LegalPage() {
  return (
    <InfoPage
      title="Legal and regulatory"
      lead="The legal framework that governs Brightwell, our policies and how we handle concerns — in one place for students, staff and the public."
      crumbs={[{ to: '/', label: 'Home' }, { to: '/about', label: 'About' }, { label: 'Legal' }]}
      sections={[
        {
          heading: 'How the University is governed',
          body: [
            'Brightwell is an institution established by statute, with its governing framework set out in the Statutes and Standing Regulations. The governing council is the principal executive body, and Congregation regulates teaching, examinations and admissions.',
            'The vice-chancellor leads the administration and is accountable to the governing council for strategy, finance and performance.',
          ],
          aside: {
            title: 'Governing documents',
            rows: [
              ['Statutes and regulations', 'Current edition'],
              ['Strategic plan', '2025 – 2035'],
              ['Financial statements', 'Published annually'],
              ['Annual review', 'Each October'],
            ],
            links: [['/strategic-plan', 'The strategic plan']],
          },
        },
        {
          heading: 'Policies and concerns',
          body: [
            'University policies cover the whole of our work, from research integrity and data protection to student discipline and procurement. The policy hub lists every policy with its owner and review date.',
          ],
          list: {
            title: 'Raising a concern',
            items: [
              'Academic or student matters — begin with your college or department.',
              'Research integrity concerns — contact the registrar’s research office.',
              'Modern slavery or ethical supply chain — the procurement complaints route.',
              'Employment or staff concerns — the human resources people relations team.',
            ],
          },
        },
        {
          heading: 'Contracts and trading',
          body: [
            'Contracts for goods, services and research are made through the University’s legal office and are governed by Nigerian law. Each school and faculty publishes its own supplementary rules where they apply.',
          ],
          aside: {
            title: 'Contact the legal office',
            rows: [
              ['Legal office', 'legal@brightwell.ng'],
              ['Procurement', 'suppliers@brightwell.ng'],
              ['Registrar', 'registrar@brightwell.ng'],
            ],
            links: [['/privacy', 'Data privacy'], ['/equality', 'Equality policy']],
          },
        },
      ]}
    />
  );
}