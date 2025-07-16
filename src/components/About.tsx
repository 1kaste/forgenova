

import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const BackArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const About: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { setShowAboutPage, content } = context;

    return (
        <article id="about" className="bg-background animate-fade-in">
            <div className="container mx-auto px-6 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                     <button 
                        onClick={() => setShowAboutPage(false)}
                        className="mb-8 flex items-center gap-2 text-primary font-bold hover:underline transition-all duration-300 transform hover:-translate-x-1"
                    >
                        <BackArrowIcon />
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-foreground">
                        About {content.companyName}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        {content.footer.about}
                    </p>
                </div>
            </div>
        </article>
    );
};

export default About;