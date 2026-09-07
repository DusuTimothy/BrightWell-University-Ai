/* ==========================================================================
   Navigation tree for the three portal roles.
   Single source of truth — the sidebar and breadcrumbs both read from here.
   ========================================================================== */

export const NAV_GROUPS = {
  admin: [
    {
      section: 'Overview',
      items: [
        { to: '/portal/admin', label: 'Dashboard', icon: 'gauge', end: true },
      ],
    },
    {
      section: 'People',
      items: [
        { to: '/portal/admin/users', label: 'Users', icon: 'users' },
        { to: '/portal/admin/users/roles', label: 'Roles & permissions', icon: 'shield' },
        { to: '/portal/admin/users/import', label: 'Bulk import', icon: 'upload' },
      ],
    },
    {
      section: 'Courses',
      items: [
        { to: '/portal/admin/learn', label: 'Course catalogue', icon: 'book-open' },
        { to: '/portal/admin/courses/approvals', label: 'Pending approvals', icon: 'clipboard-check', badge: 7 },
        { to: '/portal/admin/courses/taxonomy', label: 'Categories & tags', icon: 'folder-tree' },
      ],
    },
    {
      section: 'Finance',
      items: [
        { to: '/portal/admin/enrolments', label: 'Enrolments', icon: 'user-plus' },
        { to: '/portal/admin/payments', label: 'Payments', icon: 'credit-card' },
        { to: '/portal/admin/payments/refunds', label: 'Refunds', icon: 'rotate-ccw' },
        { to: '/portal/admin/payments/coupons', label: 'Coupons', icon: 'ticket-percent' },
        { to: '/portal/admin/reports/revenue', label: 'Revenue reports', icon: 'line-chart' },
      ],
    },
    {
      section: 'Analytics',
      items: [
        { to: '/portal/admin/analytics', label: 'Platform metrics', icon: 'bar-chart-3' },
        { to: '/portal/admin/analytics/engagement', label: 'Engagement', icon: 'activity' },
        { to: '/portal/admin/analytics/cohorts', label: 'Cohort analysis', icon: 'users-2' },
      ],
    },
    {
      section: 'Communications',
      items: [
        { to: '/portal/admin/announcements', label: 'Announcements', icon: 'megaphone' },
        { to: '/portal/admin/emails', label: 'Email templates', icon: 'mail' },
        { to: '/portal/admin/support', label: 'Support inbox', icon: 'message-circle' },
      ],
    },
    {
      section: 'System',
      items: [
        { to: '/portal/admin/audit', label: 'Audit log', icon: 'scroll-text' },
        { to: '/portal/admin/flags', label: 'Feature flags', icon: 'flag' },
        { to: '/portal/admin/integrations', label: 'Integrations', icon: 'plug' },
        { to: '/portal/admin/settings', label: 'Settings', icon: 'settings' },
      ],
    },
  ],
  teacher: [
    {
      section: 'Teach',
      items: [
        { to: '/portal/teacher', label: 'Dashboard', icon: 'layout-dashboard', end: true },
      ],
    },
    {
      section: 'My courses',
      items: [
        { to: '/portal/teacher/courses', label: 'All courses', icon: 'book-open' },
        { to: '/portal/teacher/courses/new', label: 'Create new', icon: 'plus-circle' },
      ],
    },
    {
      section: 'Content',
      items: [
        { to: '/portal/teacher/content/lessons', label: 'Lessons', icon: 'file-text' },
        { to: '/portal/teacher/content/media', label: 'Media library', icon: 'film' },
        { to: '/portal/teacher/content/questions', label: 'Question bank', icon: 'help-circle' },
      ],
    },
    {
      section: 'Assessments',
      items: [
        { to: '/portal/teacher/quizzes', label: 'Quizzes', icon: 'check-square' },
        { to: '/portal/teacher/assignments', label: 'Assignments', icon: 'file-check' },
        { to: '/portal/teacher/rubrics', label: 'Rubrics', icon: 'sliders' },
        { to: '/portal/teacher/gradebook', label: 'Gradebook', icon: 'table-2' },
      ],
    },
    {
      section: 'Students',
      items: [
        { to: '/portal/teacher/students', label: 'Roster', icon: 'users' },
        { to: '/portal/teacher/students/progress', label: 'Progress map', icon: 'map' },
        { to: '/portal/teacher/students/at-risk', label: 'At-risk students', icon: 'alert-triangle' },
      ],
    },
    {
      section: 'Analytics',
      items: [
        { to: '/portal/teacher/analytics/course', label: 'Course analytics', icon: 'bar-chart' },
        { to: '/portal/teacher/analytics/quiz', label: 'Quiz analytics', icon: 'pie-chart' },
      ],
    },
    {
      section: 'Communications',
      items: [
        { to: '/portal/teacher/announcements', label: 'Announcements', icon: 'megaphone' },
        { to: '/portal/teacher/messages', label: 'Messages', icon: 'message-square' },
      ],
    },
    {
      section: 'Settings',
      items: [
        { to: '/portal/teacher/settings/profile', label: 'Profile', icon: 'user' },
        { to: '/portal/teacher/settings/payouts', label: 'Payouts', icon: 'wallet' },
      ],
    },
  ],
  student: [
    {
      section: 'Learn',
      items: [
        { to: '/portal/student', label: 'Dashboard', icon: 'home', end: true },
      ],
    },
    {
      section: 'My courses',
      items: [
        { to: '/portal/student/courses', label: 'Enrolled', icon: 'book-open' },
        { to: '/portal/student/wishlist', label: 'Wishlist', icon: 'heart' },
        { to: '/portal/student/certificates', label: 'Certificates', icon: 'award' },
      ],
    },
    {
      section: 'Browse',
      items: [
        { to: '/portal/student/browse', label: 'Catalogue', icon: 'search' },
        { to: '/portal/student/browse/branch/secondary', label: 'By branch', icon: 'git-branch' },
      ],
    },
    {
      section: 'Schedule',
      items: [
        { to: '/portal/student/deadlines', label: 'Upcoming deadlines', icon: 'clock-alert' },
        { to: '/portal/student/calendar', label: 'Calendar', icon: 'calendar' },
      ],
    },
    {
      section: 'Progress',
      items: [
        { to: '/portal/student/grades', label: 'My grades', icon: 'bar-chart' },
        { to: '/portal/student/quizzes', label: 'Quiz history', icon: 'history' },
        { to: '/portal/student/achievements', label: 'Achievements', icon: 'trophy' },
      ],
    },
    {
      section: 'Account',
      items: [
        { to: '/portal/student/account/profile', label: 'Profile', icon: 'user' },
        { to: '/portal/student/account/notifications', label: 'Notifications', icon: 'bell' },
        { to: '/portal/student/account/help', label: 'Help & support', icon: 'life-buoy' },
      ],
    },
  ],
};

/* Flat list of all links for a role — used for the mobile collapsed menu */
export function flattenNav(role) {
  return (NAV_GROUPS[role] || []).flatMap((g) => g.items);
}