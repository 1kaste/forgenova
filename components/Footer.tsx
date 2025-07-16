import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import AdminTrigger from './AdminTrigger';

const Footer: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { content, activeServiceId, setActiveServiceId, showPortfolio, setShowPortfolio, showAboutPage, setShowAboutPage } = context;
  const { footer, contact } = content;

  const handleNavClick = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
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
        targetElement.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl font-bold text-footer-foreground mb-4">About Us</h3>
            <p className="text-sm">{footer.about}</p>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-footer-foreground mb-4">Our Links</h3>
            <ul className="space-y-2 text-sm">
              {['Home', 'About Us', 'Our Services', 'Portfolio'].map(item => {
                const href = `#${item.toLowerCase().replace(/ /g, '-')}`;
                return (
                  <li key={item}>
                    <a href={href} onClick={handleNavClick(href)} className="hover:text-accent transition-colors">{item}</a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-footer-foreground mb-4">Contact Us</h3>
            <address className="text-sm not-italic space-y-2">
              <p>{contact.address}</p>
              <p>Phone: <a href={`tel:${contact.phone}`} className="hover:text-accent transition-colors">{contact.phone}</a></p>
              <p>Email: <a href={`mailto:${contact.email}`} className="hover:text-accent transition-colors">{contact.email}</a></p>
            </address>
          </div>
           <div>
            <h3 className="font-heading text-xl font-bold text-footer-foreground mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              {content.socials.map(social => (
                <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors" aria-label={social.name}>
                  <div
                      className="w-6 h-6 bg-current"
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
        </div>
      </div>
      <div className="bg-background/10 py-4">
        <div className="container relative mx-auto px-6 text-center text-xs text-muted-foreground">
          {footer.creditLink ? (
            <a 
              href={footer.creditLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              {footer.credit}
            </a>
          ) : (
            <p>{footer.credit}</p>
          )}
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <AdminTrigger />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;