import React, { createContext, useContext, useEffect, useState } from 'react';
import { safeStorage } from '../utils/storage.ts';

export type Theme = 'light' | 'dark' | 'cyberpunk';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isCyberpunk: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Support Light, Dark, and Cyberpunk modes
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = safeStorage.getItem('scamshield_theme');
      if (saved === 'dark' || saved === 'cyberpunk' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  const applyThemeToDOM = (activeTheme: Theme) => {
    const root = document.documentElement;
    // Reset all theme classes first
    root.classList.remove('light', 'dark', 'cyberpunk');

    if (activeTheme === 'light') {
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else if (activeTheme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else if (activeTheme === 'cyberpunk') {
      // Add both dark (for Tailwind dark: utility classes) and cyberpunk
      root.classList.add('dark', 'cyberpunk');
      root.setAttribute('data-theme', 'cyberpunk');
      root.style.colorScheme = 'dark';
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      safeStorage.setItem('scamshield_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    try {
      safeStorage.setItem('scamshield_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const cycleTheme = () => {
    setThemeState(prev => {
      let next: Theme;
      if (prev === 'light') next = 'dark';
      else if (prev === 'dark') next = 'cyberpunk';
      else next = 'light';
      return next;
    });
  };

  const toggleTheme = () => {
    cycleTheme();
  };

  const isDark = theme === 'dark' || theme === 'cyberpunk';
  const isCyberpunk = theme === 'cyberpunk';

  return (
    <ThemeContext.Provider value={{ theme, isDark, isCyberpunk, setTheme, toggleTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
