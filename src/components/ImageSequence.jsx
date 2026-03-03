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

    // Force muted property to true immediately
    video.muted = true;
    video.defaultMuted = true;
    
    // Attempt playback multiple times if needed
    let playAttemptTimeout;
    const attemptPlay = async (attempt = 1) => {
      try {
        if (video && video.paused) {
          await video.play();
          console.log(`Video playing successfully on attempt ${attempt}`);
        }
      } catch (err) {
        if (attempt < 10) {
          // Retry more frequently at first, then slow down
          const delay = attempt < 5 ? 300 : 1000;
          playAttemptTimeout = setTimeout(() => attemptPlay(attempt + 1), delay);
        } else {
          console.warn('Final playback attempt failed:', err);
        }
      }
    };

    // Explicitly load the video before playing
    video.load();
    
    // Initial attempt after a very brief delay to allow DOM/Vite assets to stabilize
    const initialDelay = setTimeout(attemptPlay, 100);

    // Secondary attempts when video data is available
    const handleLoadedMetadata = () => {
      attemptPlay(1);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    
    return () => {
      clearTimeout(initialDelay);
      if (playAttemptTimeout) clearTimeout(playAttemptTimeout);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
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
