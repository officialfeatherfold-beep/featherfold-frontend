import React, { useEffect, useRef, useState } from 'react';

const ImageSequence = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Utilize Vite's import.meta.glob to synchronously load image paths
    const imageModules = import.meta.glob('../assets/ezgif-741a44f725a5367b-jpg/*.jpg', { eager: true });
    
    // Sort paths alphabetically (works since files are 001.jpg, 002.jpg, etc.)
    const imagePaths = Object.keys(imageModules)
      .sort()
      .map(key => imageModules[key].default);

    const loadedImages = new Array(imagePaths.length);
    let loadedCount = 0;

    imagePaths.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagePaths.length) {
          setImages(loadedImages);
          setLoaded(true);
        }
      };
      loadedImages[index] = img;
    });
  }, []);

  useEffect(() => {
    if (!loaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameIndex = 0;
    let animationFrameId;

    // Target frame rate: Lowered to 18 FPS for slower, calming playback
    const fps = 18;
    const interval = 1000 / fps;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      // Set canvas true dimensions to match display dimensions
      // Using clientWidth/clientHeight or parent bounds
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // initial setup

    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);
      const deltaTime = time - lastTime;

      // Only draw next frame if enough time has passed
      if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);
        
        const img = images[frameIndex];
        if (img) {
          // Object-cover logic to preserve aspect ratio and fill container
          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = img.width / img.height;
          
          let drawWidth = canvas.width;
          let drawHeight = canvas.height;
          let drawX = 0;
          let drawY = 0;

          if (canvasRatio > imgRatio) {
            drawHeight = canvas.width / imgRatio;
            drawY = (canvas.height - drawHeight) / 2;
          } else {
            drawWidth = canvas.height * imgRatio;
            drawX = (canvas.width - drawWidth) / 2;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }

        // Loop back to 0 at the end of frames
        frameIndex = (frameIndex + 1) % images.length;
      }
    };

    // Start rendering loop
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [loaded, images]);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10 transition-opacity duration-500">
          <div className="w-8 h-8 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block w-full h-full transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
};

export default ImageSequence;
