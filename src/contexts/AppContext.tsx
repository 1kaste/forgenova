import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { SiteContent, AuthLevel, ThemeMode, ThemeOptions, ServiceCardData, SocialLink } from '../types';
import { DEFAULT_CONTENT, INITIAL_ADMIN_PASSWORD, MASTER_PASSWORD } from '../constants';

interface AppContextType {
  content: SiteContent;
  updateContent: (newContent: SiteContent) => void;
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
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
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
  
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = window.location.host;
        // In dev, Vite proxy handles this. In prod, server and client are same origin.
        const wsUrl = `${protocol}://${host}`;
        
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => console.log('WebSocket connected');

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'INITIAL_CONTENT' || message.type === 'CONTENT_UPDATED') {
                setContent(message.payload);
            }
        };

        ws.current.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting in 3 seconds...');
            setTimeout(connect, 3000);
        };
        
        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            ws.current?.close();
        };
    };

    connect();

    return () => {
        if(ws.current) {
           ws.current.onclose = null; // prevent reconnect on unmount
           ws.current.close();
        }
    };
  }, []);


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

  const modifyAndBroadcast = useCallback((modificationFn: (c: SiteContent) => SiteContent) => {
    const newContent = modificationFn(content);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'UPDATE_CONTENT', payload: newContent }));
    } else {
        console.error('WebSocket is not connected.');
        alert('Could not save changes. Please check your connection and refresh.');
    }
  }, [content]);

  const updateContent = (newContent: SiteContent) => {
     modifyAndBroadcast(() => newContent);
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
    modifyAndBroadcast(currentContent => {
        const newContent = JSON.parse(JSON.stringify(currentContent));
        const now = Date.now();
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
  }, [modifyAndBroadcast]);

  const restoreItemFromTrash = useCallback((itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number, themeIndex?: number }) => {
    modifyAndBroadcast(currentContent => {
        const newContent = JSON.parse(JSON.stringify(currentContent));
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
  }, [modifyAndBroadcast]);
  
  const permanentlyDeleteItemFromTrash = useCallback((itemType: 'service' | 'theme' | 'social' | 'galleryImage', ids: { serviceId?: number; imageIndex?: number; itemId?: number, themeIndex?: number }) => {
    modifyAndBroadcast(currentContent => {
        const newContent = JSON.parse(JSON.stringify(currentContent));
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
  }, [modifyAndBroadcast]);


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
  
  const updateAdminPassword = (newPass: string) => setAdminPassword(newPass);
  const updateMasterPassword = (newPass: string) => setMasterPassword(newPass);
  const setInactivityTimeout = (seconds: number) => setInactivityTimeoutState(seconds);
  const resetAdminPassword = () => setAdminPassword(INITIAL_ADMIN_PASSWORD);

  return (
    <AppContext.Provider value={{ 
        content, 
        updateContent, 
        themeMode, 
        setThemeMode, 
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
