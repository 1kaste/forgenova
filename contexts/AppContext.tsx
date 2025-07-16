

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { SiteContent, AuthLevel, ThemeMode, ThemeOptions, ServiceCardData, SocialLink } from '../types';
import { DEFAULT_CONTENT, INITIAL_ADMIN_PASSWORD, MASTER_PASSWORD } from '../constants';

interface AppContextType {
  content: SiteContent;
  updateContent: (newContent: Partial<SiteContent> | ((c: SiteContent) => SiteContent)) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  authLevel: AuthLevel;
  login: (password: string) => boolean;
  devLogin: (password: string) => boolean;
  logout: () => void;
  showAdminPanel: boolean;
  setShowAdminPanel: (show: boolean) => void;
  isDefaultAdminPassword: boolean;
  updateAdminPassword: (newPass: string) => void;
  updateMasterPassword: (newPass: string) => void;
  inactivityTimeout: number;
  setInactivityTimeout: (seconds: number) => void;
  resetAdminPassword: () => void;
  activeServiceId: number | null;
  setActiveServiceId: (id: number | null) => void;
  showPortfolio: boolean;
  setShowPortfolio: (show: boolean) => void;
  showAboutPage: boolean;
  setShowAboutPage: (show: boolean) => void;
  isLightboxOpen: boolean;
  setIsLightboxOpen: (isOpen: boolean) => void;
  moveItemToTrash: (itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number; themeIndex?: number; }) => void;
  restoreItemFromTrash: (itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number; themeIndex?: number; }) => void;
  permanentlyDeleteItemFromTrash: (itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number; themeIndex?: number; }) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const getStoredValue = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (item) {
        const parsed = JSON.parse(item);
        if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue)) {
             return { ...defaultValue, ...parsed };
        }
        return parsed;
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => getStoredValue('siteContent', DEFAULT_CONTENT));
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getStoredValue('themeMode', ThemeMode.DARK));
  const [authLevel, setAuthLevel] = useState<AuthLevel>(AuthLevel.NONE);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const [adminPassword, setAdminPassword] = useState<string>(() => getStoredValue('adminPassword', INITIAL_ADMIN_PASSWORD));
  const [masterPassword, setMasterPassword] = useState<string>(() => getStoredValue('masterPassword', MASTER_PASSWORD));
  const [isDefaultAdminPassword, setIsDefaultAdminPassword] = useState(() => adminPassword === INITIAL_ADMIN_PASSWORD);
  const [inactivityTimeout, setInactivityTimeoutState] = useState(() => getStoredValue('inactivityTimeout', 300)); // 5 minutes default
  
  const [activeServiceId, _setActiveServiceId] = useState<number | null>(null);
  const [showPortfolio, _setShowPortfolio] = useState<boolean>(false);
  const [showAboutPage, _setShowAboutPage] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const AUTO_DELETE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  useEffect(() => {
    localStorage.setItem('siteContent', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem('themeMode', JSON.stringify(themeMode));
  }, [themeMode]);
  
  useEffect(() => {
    localStorage.setItem('adminPassword', JSON.stringify(adminPassword));
    setIsDefaultAdminPassword(adminPassword === INITIAL_ADMIN_PASSWORD);
  }, [adminPassword]);

  useEffect(() => {
    localStorage.setItem('masterPassword', JSON.stringify(masterPassword));
  }, [masterPassword]);

  useEffect(() => {
    localStorage.setItem('inactivityTimeout', JSON.stringify(inactivityTimeout));
  }, [inactivityTimeout]);
  
  useEffect(() => {
    const cleaner = setInterval(() => {
      setContent(currentContent => {
        const now = Date.now();
        let hasChanged = false;

        const clean = <T extends { deletedOn?: number }>(items: T[] | undefined): T[] => {
            if (!items) return [];
            const newItems = items.filter(item => !item.deletedOn || (now - (item.deletedOn as number) < AUTO_DELETE_DURATION));
            if (newItems.length !== items.length) hasChanged = true;
            return newItems;
        };

        const newServices = clean(currentContent.services).map(service => {
            const originalDeletedGalleryCount = service.deletedGallery?.length || 0;
            const updatedService = { ...service, deletedGallery: clean(service.deletedGallery) };
            if (updatedService.deletedGallery.length !== originalDeletedGalleryCount) hasChanged = true;
            return updatedService;
        });

        const newThemes = clean(currentContent.themes);
        const newSocials = clean(currentContent.socials);
        
        if (hasChanged) {
          return { ...currentContent, services: newServices, themes: newThemes, socials: newSocials };
        }
        return currentContent;
      });
    }, 60 * 1000); // Check every minute

    return () => clearInterval(cleaner);
  }, []);


  const updateContent = (newContent: Partial<SiteContent> | ((c: SiteContent) => SiteContent)) => {
     if (typeof newContent === 'function') {
        setContent(newContent);
    } else {
        setContent(prev => ({ ...prev, ...newContent }));
    }
  };

  const setThemeMode = (newTheme: ThemeMode) => setThemeModeState(newTheme);

  const logout = useCallback(() => {
    setAuthLevel(AuthLevel.NONE);
    setShowAdminPanel(false);
  }, []);

  useEffect(() => {
    let activityTimer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(activityTimer);
      if (authLevel !== AuthLevel.NONE) {
        activityTimer = setTimeout(logout, inactivityTimeout * 1000);
      }
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(activityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [authLevel, inactivityTimeout, logout]);
  
  const moveItemToTrash = useCallback((itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number, themeIndex?: number }) => {
    const now = Date.now();
    setContent(prev => {
        const newContent = JSON.parse(JSON.stringify(prev));
        switch (itemType) {
            case 'service':
                newContent.services.find((s: ServiceCardData) => s.id === ids.itemId).deletedOn = now;
                break;
            case 'theme':
                newContent.themes[ids.themeIndex!].deletedOn = now;
                break;
            case 'social':
                newContent.socials.find((s: SocialLink) => s.id === ids.itemId).deletedOn = now;
                break;
            case 'galleryImage': {
                const service = newContent.services.find((s: ServiceCardData) => s.id === ids.serviceId);
                const imageToMove = service.gallery.splice(ids.imageIndex!, 1)[0];
                if (!service.deletedGallery) service.deletedGallery = [];
                service.deletedGallery.push({ url: imageToMove, deletedOn: now });
                break;
            }
        }
        return newContent;
    });
  }, []);

  const restoreItemFromTrash = useCallback((itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number, themeIndex?: number }) => {
    setContent(prev => {
        const newContent = JSON.parse(JSON.stringify(prev));
         switch (itemType) {
            case 'service':
                delete newContent.services.find((s: ServiceCardData) => s.id === ids.itemId).deletedOn;
                break;
            case 'theme':
                delete newContent.themes[ids.themeIndex!].deletedOn;
                break;
            case 'social':
                delete newContent.socials.find((s: SocialLink) => s.id === ids.itemId).deletedOn;
                break;
            case 'galleryImage': {
                const service = newContent.services.find((s: ServiceCardData) => s.id === ids.serviceId);
                const imageToRestore = service.deletedGallery.splice(ids.imageIndex!, 1)[0];
                service.gallery.push(imageToRestore.url);
                break;
            }
        }
        return newContent;
    });
  }, []);
  
  const permanentlyDeleteItemFromTrash = useCallback((itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number, themeIndex?: number }) => {
    setContent(prev => {
        const newContent = JSON.parse(JSON.stringify(prev));
        switch (itemType) {
            case 'service':
                newContent.services = newContent.services.filter((s: ServiceCardData) => s.id !== ids.itemId);
                break;
            case 'theme':
                newContent.themes = newContent.themes.filter((_: any, i: number) => i !== ids.themeIndex);
                break;
            case 'social':
                newContent.socials = newContent.socials.filter((s: SocialLink) => s.id !== ids.itemId);
                break;
            case 'galleryImage': {
                const service = newContent.services.find((s: ServiceCardData) => s.id === ids.serviceId);
                service.deletedGallery.splice(ids.imageIndex!, 1);
                break;
            }
        }
        return newContent;
    });
  }, []);


  const setActiveServiceId = useCallback((id: number | null) => {
    _setActiveServiceId(id);
    if (id !== null) {
      _setShowPortfolio(false);
      _setShowAboutPage(false);
    }
  }, []);
  
  const setShowPortfolio = useCallback((show: boolean) => {
    _setShowPortfolio(show);
    if (show) {
      _setActiveServiceId(null);
      _setShowAboutPage(false);
    }
  }, []);

  const setShowAboutPage = useCallback((show: boolean) => {
    _setShowAboutPage(show);
    if (show) {
      _setActiveServiceId(null);
      _setShowPortfolio(false);
    }
  }, []);

  const login = (password: string) => {
    if (password === masterPassword) {
      setAuthLevel(AuthLevel.DEV);
      return true;
    }
    if (password === adminPassword) {
      setAuthLevel(AuthLevel.ADMIN);
      return true;
    }
    return false;
  };
  
  const devLogin = (password: string) => {
    if (password === masterPassword) {
      setAuthLevel(AuthLevel.DEV);
      return true;
    }
    return false;
  };
  
  const updateAdminPassword = (newPass: string) => {
      setAdminPassword(newPass);
  };
  
  const updateMasterPassword = (newPass: string) => {
      setMasterPassword(newPass);
  };
  
  const setInactivityTimeout = (seconds: number) => {
      setInactivityTimeoutState(seconds);
  };
  
  const resetAdminPassword = () => {
      setAdminPassword(INITIAL_ADMIN_PASSWORD);
  }

  return (
    <AppContext.Provider value={{ 
        content, 
        updateContent, 
        themeMode, 
        setThemeMode: setThemeMode, 
        authLevel,
        login,
        devLogin,
        logout,
        showAdminPanel,
        setShowAdminPanel,
        isDefaultAdminPassword,
        updateAdminPassword,
        updateMasterPassword,
        inactivityTimeout,
        setInactivityTimeout,
        resetAdminPassword,
        activeServiceId,
        setActiveServiceId,
        showPortfolio,
        setShowPortfolio,
        showAboutPage,
        setShowAboutPage,
        isLightboxOpen,
        setIsLightboxOpen,
        moveItemToTrash,
        restoreItemFromTrash,
        permanentlyDeleteItemFromTrash,
      }}>
      {children}
    </AppContext.Provider>
  );
};
