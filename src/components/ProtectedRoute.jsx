import React from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, user, requiredRole = 'admin' }) => {
  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Authentication Required</h2>
          <p className="text-gray-600 text-center mb-6">Please sign in to access this page.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Admin Access Only</p>
                <p className="text-sm text-blue-700 mt-1">This page requires administrator privileges to access.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has required role (admin)
  if (requiredRole === 'admin' && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Access Denied</h2>
          <p className="text-gray-600 text-center mb-6">You don't have permission to access the admin dashboard.</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Admin Privileges Required</p>
                <p className="text-sm text-red-700 mt-1">Only administrators can access this dashboard.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Contact your system administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;
