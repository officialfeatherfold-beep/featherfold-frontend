/**
 * consoleGuard.js
 *
 * Suppresses console output for non-admin users in production.
 * Admin users (identified by localStorage) retain full console access.
 *
 * Admin console can be re-enabled at any time by running in browser console:
 *   localStorage.setItem('ff_admin', 'true')
 * and refreshing the page.
 */

const ADMIN_EMAILS = [
  'admin@featherfold.com',
  'priyansh@featherfold.com',
];

const isAdminSession = () => {
  try {
    // Check explicit admin flag set by consoleGuard
    if (localStorage.getItem('ff_admin') === 'true') return true;

    // Check user data stored by the auth system
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.isAdmin === true) return true;
      if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
    }
  } catch {
    // If localStorage is unavailable, default to non-admin
  }
  return false;
};

export const initConsoleGuard = () => {
  // Only suppress in production builds
  if (import.meta.env.DEV) return;

  if (!isAdminSession()) {
    const noop = () => {};
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.debug = noop;
    // console.error is intentionally left functional for critical issues
  }
};
