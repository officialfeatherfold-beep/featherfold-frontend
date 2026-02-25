import React, { useEffect, useRef, useState } from 'react';

const ImageSequence = () => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    // Utilize Vite's import.meta.glob to synchronously load image paths
    const imageModules = import.meta.glob('../assets/ezgif-741a44f725a5367b-jpg/*.jpg', { eager: true });
    
    // Sort paths alphabetically (works since files are 001.jpg, 002.jpg, etc.)
    const imagePaths = Object.keys(imageModules)
      .sort()
      .map(key => imageModules[key].default);

    const totalCount = imagePaths.length;
    imagesRef.current = new Array(totalCount);

    // Load the FIRST frame immediately for instant display
    const firstImg = new Image();
    firstImg.src = imagePaths[0];
    firstImg.onload = () => {
      imagesRef.current[0] = firstImg;
      loadedCountRef.current = 1;
      setFirstFrameReady(true);

      // Then load the rest in small batches to avoid blocking
      loadRemainingImages(imagePaths, totalCount);
    };

    function loadRemainingImages(paths, total) {
      const BATCH_SIZE = 6; // Load 6 images at a time
      let nextIndex = 1;

      function loadBatch() {
        const batchEnd = Math.min(nextIndex + BATCH_SIZE, total);
        let batchPending = batchEnd - nextIndex;

        if (batchPending <= 0) return;

        for (let i = nextIndex; i < batchEnd; i++) {
          const img = new Image();
          const idx = i; // closure capture
          img.src = paths[idx];
          img.onload = () => {
            imagesRef.current[idx] = img;
            loadedCountRef.current++;
            batchPending--;

            if (loadedCountRef.current === total) {
              setAllLoaded(true);
            }

            // When this batch finishes, schedule the next batch
            if (batchPending === 0 && loadedCountRef.current < total) {
              // Small delay to let the browser breathe
              setTimeout(loadBatch, 16);
            }
          };
          img.onerror = () => {
            batchPending--;
            if (batchPending === 0 && loadedCountRef.current < total) {
              setTimeout(loadBatch, 16);
            }
          };
        }
        nextIndex = batchEnd;
      }

      loadBatch();
    }
  }, []);

  useEffect(() => {
    if (!firstFrameReady || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameIndex = 0;
    let animationFrameId;

    // Target frame rate: 18 FPS for slower, calming playback
    const fps = 18;
    const interval = 1000 / fps;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);
      const deltaTime = time - lastTime;

      if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);
        
        // Only advance to frames that are loaded
        const img = imagesRef.current[frameIndex];
        if (img) {
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

        // Only advance to the next frame if it's loaded, otherwise stay on current
        const nextFrame = (frameIndex + 1) % imagesRef.current.length;
        if (imagesRef.current[nextFrame]) {
          frameIndex = nextFrame;
        }
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [firstFrameReady]);

  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-[#2c1810]">
      {!firstFrameReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2c1810] text-white z-10 transition-opacity duration-500">
          <div className="text-center">
            <div className="w-10 h-10 border-3 border-[#c9982e] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-white/50 font-medium">Loading...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="block w-full h-full transition-opacity duration-700"
        style={{ opacity: firstFrameReady ? 1 : 0 }}
      />
    </div>
  );
};

export default ImageSequence;
