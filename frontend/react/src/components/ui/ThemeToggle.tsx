'use client';

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg card hover:scale-105 transition-all duration-200 ${className}`}
      style={{
        backgroundColor: 'rgb(var(--background-primary))',
        border: '1px solid rgb(var(--border-color))',
        color: 'rgb(var(--text-primary))'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon 
          className="h-5 w-5 transition-colors duration-200" 
          style={{ color: 'rgb(var(--text-secondary))' }}
        />
      ) : (
        <SunIcon 
          className="h-5 w-5 transition-colors duration-200" 
          style={{ color: 'rgb(var(--accent-secondary))' }}
        />
      )}
    </button>
  );
};

export default ThemeToggle;
