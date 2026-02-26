import React, { useRef, useState } from 'react';

// Import the video assets so Vite hashes and bundles them
import heroMp4 from '../assets/hero-background-web.mp4';
import heroWebm from '../assets/hero-background-web.webm';

const ImageSequence = () => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#2c1810]">
      {/* Loading state — shown until video can play */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2c1810] text-white z-10 transition-opacity duration-500">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[#c9982e] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-white/50 font-medium">Loading...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        className="block w-full h-full object-cover transition-opacity duration-700"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        {/* WebM first for browsers that support it (smaller file) */}
        <source src={heroWebm} type="video/webm" />
        {/* MP4 fallback for Safari and older browsers */}
        <source src={heroMp4} type="video/mp4" />
      </video>
    </div>
  );
};

export default ImageSequence;
