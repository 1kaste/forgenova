import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-2.382-9.971z" />
    </svg>
);

const AdminTrigger: React.FC = () => {
    const context = useContext(AppContext);
    const [clickCount, setClickCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    if (!context || context.authLevel !== 0) return null;

    const { setShowAdminPanel } = context;

    const handleClick = () => {
        // Clear any existing timer to reset the countdown
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const newClickCount = clickCount + 1;

        if (newClickCount >= 3) {
            // On the third click, open the panel and reset
            setShowAdminPanel(true);
            setClickCount(0);
        } else {
            // For first and second clicks, update count and set a timer
            setClickCount(newClickCount);
            timerRef.current = setTimeout(() => {
                // If the timer runs out, reset the click count
                setClickCount(0);
            }, 1000); // User has 1 second to click again
        }
    };

    return (
        <button
            onClick={handleClick}
            className="hidden md:block text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
            aria-label="Open Admin Panel"
        >
            <ShieldIcon />
        </button>
    );
};

export default AdminTrigger;