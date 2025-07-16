import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ServiceCardData } from '../types';

const ServiceCard: React.FC<{ service: ServiceCardData }> = ({ service }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { setActiveServiceId } = context;

  const handleClick = () => {
    setActiveServiceId(service.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${service.title}`}
      className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background"
    >
      <img src={service.image} alt={service.title} className="w-full h-48 object-cover"/>
      <div className="p-6">
        <h3 className="font-heading text-2xl font-bold mb-2">{service.title}</h3>
        <p className="text-muted-foreground">{service.description}</p>
      </div>
    </div>
  );
};


const Services: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { services } = context.content;
  const visibleServices = services.filter(s => !s.deletedOn);

  return (
    <section id="our-services" className="py-20 bg-muted">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-heading font-bold text-center mb-12 text-foreground">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
