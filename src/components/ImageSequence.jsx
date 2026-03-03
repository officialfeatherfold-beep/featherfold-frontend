import React, { useRef, useEffect } from 'react';

// Import the video assets so Vite hashes and bundles them
import heroMp4 from '../assets/hero-background-web.mp4';
import heroWebm from '../assets/hero-background-web.webm';
import heroPoster from '../assets/hero-poster.jpg';

const ImageSequence = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Standard initialization: ensure properties are set on DOM element
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;

    const playVideo = async () => {
      try {
        if (video.paused) {
          await video.play();
        }
      } catch (err) {
        console.warn('Playback failed:', err);
      }
    };

    // Trigger play on mount and on standard state events
    playVideo();
    
    // Fallback trigger if initial mount play fails due to resource loading
    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('canplay', playVideo);
    
    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#2c1810]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPoster}
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
