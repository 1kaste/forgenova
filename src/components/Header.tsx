import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';

const PhoneIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
);
const EmailIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
);
const HamburgerIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);


const Header: React.FC = () => {
  const context = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (context?.isLightboxOpen) {
      setIsMenuOpen(false);
    }
  }, [context?.isLightboxOpen]);

  if (!context) return null;

  const { content, activeServiceId, setActiveServiceId, showPortfolio, setShowPortfolio, showAboutPage, setShowAboutPage, themeMode } = context;
  const { companyName, contact, socials, logo } = content;

  const handleNavClick = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const id = hash.substring(1);
    
    if (id === 'portfolio') {
        setShowPortfolio(true);
        return;
    }
    
    if (id === 'about-us') {
        setShowAboutPage(true);
        return;
    }

    const scrollToTarget = () => {
      const targetElement = document.getElementById(id);
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (targetElement){
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (activeServiceId !== null || showPortfolio || showAboutPage) {
      setActiveServiceId(null);
      setShowPortfolio(false);
      setShowAboutPage(false);
      setTimeout(scrollToTarget, 100);
    } else {
      scrollToTarget();
    }
  };

  const navItems = ['Home', 'About Us', 'Our Services', 'Portfolio'];
  const logoUrl = themeMode === 'dark' ? logo.dark : logo.light;

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-header-top-bar text-header-top-bar-foreground text-xs sm:text-sm py-2">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Follow us:</span>
            <div className="flex items-center gap-3">
              {socials.filter(s => !s.deletedOn).map(social => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label={social.name}>
                  <div
                    className="w-5 h-5 bg-current"
                    style={{
                      maskImage: `url("${social.iconUrl}")`,
                      WebkitMaskImage: `url("${social.iconUrl}")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <PhoneIcon />
              <span className="hidden sm:inline">{contact.phone}</span>
            </a>
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-accent transition-colors">
              <EmailIcon />
              <span className="hidden sm:inline">{contact.email}</span>
            </a>
          </div>
        </div>
      </div>
      <nav className="bg-header-main/80 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={handleNavClick('#home')} className="font-heading text-2xl font-bold text-header-main-foreground focus:outline-none" aria-label={`Back to ${companyName} homepage`}>
            {logoUrl ? <img src={logoUrl} alt={companyName} className="h-10" /> : companyName}
          </button>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-bold text-header-main-foreground">
            {navItems.map(item => {
              const href = `#${item.toLowerCase().replace(/ /g, '-')}`;
              return <a key={item} href={href} onClick={handleNavClick(href)} className="hover:text-primary transition-colors">{item}</a>
            })}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(true)} className="text-header-main-foreground" aria-label="Open menu">
                <HamburgerIcon />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-secondary/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in md:hidden">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-6 right-6 text-secondary-foreground text-4xl hover:text-accent transition-colors" aria-label="Close menu">
                <CloseIcon />
            </button>
            <div className="flex flex-col items-center gap-8 font-bold text-secondary-foreground text-3xl">
                {navItems.map(item => {
                    const href = `#${item.toLowerCase().replace(/ /g, '-')}`;
                    return <a key={item} href={href} onClick={handleNavClick(href)} className="hover:text-accent transition-colors">{item}</a>
                })}
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;