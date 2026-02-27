import React, { useRef } from 'react';

// Import the video assets so Vite hashes and bundles them
import heroMp4 from '../assets/hero-background-web.mp4';
import heroWebm from '../assets/hero-background-web.webm';

const ImageSequence = () => {
  const videoRef = useRef(null);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#2c1810]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        fetchpriority="high"
        className="block w-full h-full object-cover"
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
