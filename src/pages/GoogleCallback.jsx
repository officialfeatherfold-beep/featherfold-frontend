import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGoogleCallback, apiService } from '../services/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const result = handleGoogleCallback();

    if (result.success) {
      console.log('Google login successful:', result.user);
      apiService.setToken(result.token);
      // Redirect to home or dashboard
      setTimeout(() => navigate('/'), 500);
    } else {
      console.error('Google login failed:', result.error);
      setError(result.error || 'Authentication failed');
      // Redirect to login after showing error
      setTimeout(() => navigate('/'), 2000);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg font-medium">
          {error ? `Error: ${error}` : 'Signing you in with Google...'}
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
