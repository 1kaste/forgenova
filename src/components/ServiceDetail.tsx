import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import ImageLightbox from './ImageLightbox';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

const ServiceDetail: React.FC = () => {
  const context = useContext(AppContext);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!context) return null;
  const { activeServiceId, setActiveServiceId, content, setIsLightboxOpen } = context;

  const service = content.services.find(s => s.id === activeServiceId && !s.deletedOn);

  // If service is not found (e.g., deleted while viewing), go back to services list
  useEffect(() => {
    if (activeServiceId !== null && !service) {
      setActiveServiceId(null);
    }
  }, [activeServiceId, service, setActiveServiceId]);

  if (!service) {
    return null;
  }
  
  const handleBackClick = () => {
    setActiveServiceId(null);
    setTimeout(() => {
        const servicesSection = document.getElementById('our-services');
        if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 100);
  };

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

  const lightboxImages = service.gallery.map((src, index) => ({
    src: src,
    alt: `${service.title} gallery image ${index + 1}`
  }));

  return (
    <article className="bg-background animate-fade-in">
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <button 
                  onClick={handleBackClick}
                  aria-label="Back to all services"
                  className="mb-8 w-12 h-12 flex items-center justify-center rounded-full bg-card text-primary hover:bg-muted transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
                >
                  <BackArrowIcon />
                </button>
                
                <h1 className="font-heading text-5xl font-bold text-primary mb-4">{service.title}</h1>
                <p className="text-lg max-w-3xl mb-12 text-muted-foreground">{service.longDescription}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {service.gallery.map((imgSrc, index) => (
                    <div 
                        key={index} 
                        className="group rounded-lg overflow-hidden shadow-lg aspect-[4/3] cursor-pointer"
                        onClick={() => handleImageClick(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleImageClick(index); }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View image ${index + 1} of ${service.title}`}
                    >
                        <img 
                            src={imgSrc} 
                            alt={`${service.title} gallery image ${index + 1}`} 
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
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

export default ServiceDetail;
