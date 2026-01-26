import React from 'react';
import { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onCycle: () => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const ComputerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const themeLabels: Record<Theme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System preference',
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onCycle }) => {
  return (
    <button
      onClick={onCycle}
      className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-stone-900 transition-colors"
      aria-label={`Current theme: ${themeLabels[theme]}. Click to change.`}
      title={themeLabels[theme]}
    >
      {theme === 'light' && <SunIcon className="h-5 w-5" />}
      {theme === 'dark' && <MoonIcon className="h-5 w-5" />}
      {theme === 'system' && <ComputerIcon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
