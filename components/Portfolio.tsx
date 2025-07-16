
import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import ImageLightbox from './ImageLightbox';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const Portfolio: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { content, setShowPortfolio, setIsLightboxOpen } = context;
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const allImages = content.services.flatMap(service => service.gallery.map(img => ({
        src: img,
        title: service.title,
    })));
    
    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
        setIsLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setLightboxOpen(false);
        setSelectedImageIndex(null);
        setIsLightboxOpen(false);
    };

    const lightboxImages = allImages.map(img => ({ src: img.src, alt: img.title }));

    return (
        <article id="portfolio" className="bg-background animate-fade-in">
            <style>{`
                .aspect-w-4 { position: relative; padding-bottom: 75%; }
                .aspect-w-4 > * { position: absolute; height: 100%; width: 100%; top: 0; right: 0; bottom: 0; left: 0; }
            `}</style>
            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <button 
                        onClick={() => setShowPortfolio(false)}
                        className="mb-8 flex items-center gap-2 text-primary font-bold hover:underline transition-all duration-300 transform hover:-translate-x-1"
                    >
                        <BackArrowIcon />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 text-foreground">Our Portfolio</h1>
                    
                    <div className="grid grid-cols-3 gap-6">
                        {allImages.map((image, index) => (
                            <div 
                                key={index} 
                                className="group rounded-lg overflow-hidden shadow-lg aspect-w-4 aspect-h-3 relative bg-card cursor-pointer"
                                onClick={() => handleImageClick(index)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleImageClick(index); }}
                                tabIndex={0}
                                role="button"
                                aria-label={`View image of ${image.title}`}
                            >
                                <img 
                                    src={image.src} 
                                    alt={`${image.title} gallery image`} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-4">
                                  <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-4 group-hover:translate-y-0">{image.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {lightboxOpen && selectedImageIndex !== null && (
                <ImageLightbox 
                    images={lightboxImages}
                    startIndex={selectedImageIndex}
                    onClose={handleCloseLightbox}
                />
            )}
        </article>
    );
}

export default Portfolio;
