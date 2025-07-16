import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { SiteContent, AuthLevel, ThemeMode /* Removed unused: ServiceCardData, SocialLink */ } from '../types';
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
        const host = import.meta.env.DEV ? 'localhost:3001' : window.location.host;
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

  const updateContent = useCallback((newContent: SiteContent) => {
    setContent(newContent); // Optimistic update
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'UPDATE_CONTENT', payload: newContent }));
    } else {
        console.error('WebSocket is not connected. Changes may not be saved.');
        alert('Could not save changes to the server. Your changes are visible locally but may be lost on refresh.');
    }
  }, []);

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
      }}>
      {children}
    </AppContext.Provider>
  );
};