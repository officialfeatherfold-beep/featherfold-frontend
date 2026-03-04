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

    // Sync DOM properties — more reliable than HTML attributes alone
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
        // Ignore NotAllowedError (browser autoplay policy) — video will play on first user interaction
      }
    };

    // Attempt immediately and on readiness events
    playVideo();
    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#2c1810]">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={heroPoster}
        // Inline style overrides any global CSS height:auto that could collapse the video
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        fetchpriority="high"
      >
        {/* WebM first for smaller file size in supported browsers */}
        <source src={heroWebm} type="video/webm" />
        {/* MP4 fallback for Safari and older browsers */}
        <source src={heroMp4} type="video/mp4" />
      </video>
    </div>
  );
};

export default ImageSequence;
