

import React, { useContext, useEffect } from 'react';
import { AppContext } from './contexts/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import ServiceDetail from './components/ServiceDetail';
import Portfolio from './components/Portfolio';
import About from './components/About';
import ThemeToggleButton from './components/ThemeToggleButton';
import DynamicStyles from './components/DynamicStyles';
import ResumeEditingButton from './components/ResumeEditingButton';

const App: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }

  const { themeMode, showAdminPanel, activeServiceId, showPortfolio, showAboutPage, isLightboxOpen } = context;

  useEffect(() => {
    const root = window.document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);
  
  useEffect(() => {
    // Scroll to top when navigating to a detail page, portfolio, or about page.
    if (activeServiceId !== null || showPortfolio || showAboutPage) {
      window.scrollTo(0, 0);
    }
  }, [activeServiceId, showPortfolio, showAboutPage]);


  return (
    <div className="bg-background text-foreground font-body transition-colors duration-500">
      <DynamicStyles />
      {!isLightboxOpen && <Header />}
      <main>
        {activeServiceId !== null ? (
            <ServiceDetail />
          ) : showPortfolio ? (
            <Portfolio />
          ) : showAboutPage ? (
            <About />
          ) : (
            <>
              <Hero />
              <Services />
            </>
        )}
      </main>
      {!isLightboxOpen && <Footer />}
      {showAdminPanel && <AdminPanel />}
      {!isLightboxOpen && !showAdminPanel && <ThemeToggleButton />}
      {!isLightboxOpen && <ResumeEditingButton />}
    </div>
  );
};

export default App;