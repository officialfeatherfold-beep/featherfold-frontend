// Admin setup utility for development
import { ADMIN_EMAILS } from './adminUtils';

// Add your email to admin list for testing
export const setupAdminForTesting = () => {
  // Add your test email here
  const testEmail = 'test@example.com'; // Replace with your actual email
  
  if (!ADMIN_EMAILS.includes(testEmail)) {
    ADMIN_EMAILS.push(testEmail);
    console.log(`Added ${testEmail} to admin list for testing`);
  }
};

// Function to manually set admin status (for development only)
export const setAdminStatus = (email, isAdmin = true) => {
  const user = JSON.parse(localStorage.getItem('featherfold_user') || '{}');
  
  if (user.email === email) {
    user.isAdmin = isAdmin;
    localStorage.setItem('featherfold_user', JSON.stringify(user));
    console.log(`Set admin status to ${isAdmin} for ${email}`);
    return true;
  }
  
  console.log(`User with email ${email} not found`);
  return false;
};
