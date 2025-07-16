
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ImageLightboxProps {
  images: { src: string; alt: string; }[];
  startIndex: number;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNext = useCallback(() => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length, isAnimating]);

  const goToPrevious = useCallback(() => {
    if (isAnimating || images.length <= 1) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length, isAnimating]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if(wheelTimeoutRef.current) return; // Debounce

      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
      
      wheelTimeoutRef.current = setTimeout(() => {
        wheelTimeoutRef.current = null;
      }, 150); // Adjust debounce delay
    };

    window.addEventListener('keydown', handleKeyDown);
    const lightboxContainer = document.getElementById('lightbox-container');
    lightboxContainer?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      lightboxContainer?.removeEventListener('wheel', handleWheel);
      if(wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [goToNext, goToPrevious, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 300); // Animation duration
    return () => clearTimeout(timer);
  }, [currentIndex]);


  return (
    <div
      id="lightbox-container"
      className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        className="absolute top-3 left-3 md:top-4 md:left-6 text-white text-5xl font-light hover:text-accent transition-colors z-[101]"
        onClick={onClose}
        aria-label="Close image viewer"
      >
        &times;
      </button>

      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {images.length > 1 && (
          <>
            <button
              className="absolute left-0 md:left-10 text-white p-4 text-4xl hover:bg-white/10 rounded-full transition-all duration-300 z-[101]"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <button
              className="absolute right-0 md:right-10 text-white p-4 text-4xl hover:bg-white/10 rounded-full transition-all duration-300 z-[101]"
              onClick={goToNext}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </>
        )}

        <div className="relative w-auto h-auto max-w-[90vw] max-h-[85vh] flex items-center justify-center">
            <img
                key={currentIndex}
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="block max-w-full max-h-full rounded-lg shadow-2xl animate-zoom-in"
                style={{
                  transition: 'opacity 0.3s ease-in-out',
                  opacity: isAnimating ? 0.5 : 1
                }}
            />
        </div>

      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm z-[101]">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;