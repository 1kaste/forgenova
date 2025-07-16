import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Hero: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { hero } = context.content;

  const sectionStyle = {
    backgroundImage: `url(${hero.image})`,
  };

  return (
    <section id="home" className="relative h-[70vh] bg-cover bg-center flex items-center justify-center" style={sectionStyle}>
      <div className="absolute inset-0 bg-hero-overlay/50"></div>
      <div className="relative text-center max-w-4xl mx-auto px-6 text-hero-foreground">
        <h1 className="font-heading text-6xl md:text-8xl font-bold mb-4 drop-shadow-lg">{hero.heading}</h1>
        <p className="text-lg md:text-xl font-body max-w-3xl mx-auto drop-shadow-md">{hero.subheading}</p>
      </div>
    </section>
  );
};

export default Hero;