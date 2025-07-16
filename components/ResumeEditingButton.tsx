import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { AuthLevel } from '../types';

const ResumeEditingButton: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { authLevel, showAdminPanel, setShowAdminPanel } = context;

  const isVisible = authLevel !== AuthLevel.NONE && !showAdminPanel;

  if (!isVisible) return null;

  return (
    <button
      onClick={() => setShowAdminPanel(true)}
      className="fixed bottom-5 left-5 z-30 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background bg-secondary text-secondary-foreground font-bold"
      aria-label="Resume editing session"
    >
      Admin Panel
    </button>
  );
};

export default ResumeEditingButton;
