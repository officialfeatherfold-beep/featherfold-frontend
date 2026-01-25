// Utility functions for admin management
export const ADMIN_EMAILS = [
  'admin@featherfold.com',
  'priyansh@featherfold.com',
  // Add other admin emails here
];

export const isAdminUser = (user) => {
  if (!user || !user.email) return false;
  
  // Check if user's email is in admin list
  const isAdminByEmail = ADMIN_EMAILS.includes(user.email.toLowerCase());
  
  // For development, also check if user has admin flag set
  const isAdminByFlag = user.isAdmin === true;
  
  return isAdminByEmail || isAdminByFlag;
};

export const makeUserAdmin = (user) => {
  if (!user) return null;
  
  // Only make admin if email is in allowed list
  if (isAdminUser(user)) {
    return {
      ...user,
      isAdmin: true
    };
  }
  
  return user;
};

// For development/testing - remove in production
export const setDevAdmin = (user) => {
  if (process.env.NODE_ENV === 'development') {
    return {
      ...user,
      isAdmin: true
    };
  }
  return user;
};
