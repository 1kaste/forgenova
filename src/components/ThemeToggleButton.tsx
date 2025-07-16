import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ThemeMode } from '../types';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


const ThemeToggleButton: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { themeMode, setThemeMode } = context;

    const toggleTheme = () => {
        setThemeMode(themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-5 right-5 z-30 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background bg-primary text-primary-foreground"
            aria-label={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
        >
           <div className="relative w-6 h-6">
                <span className={`absolute inset-0 transition-opacity duration-300 ${themeMode === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                    <SunIcon />
                </span>
                <span className={`absolute inset-0 transition-opacity duration-300 ${themeMode === 'light' ? 'opacity-100' : 'opacity-0'}`}>
                    <MoonIcon />
                </span>
           </div>
        </button>
    );
};

export default ThemeToggleButton;