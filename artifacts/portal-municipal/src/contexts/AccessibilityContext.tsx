import React, { createContext, useContext, useEffect, useState } from 'react';

type FontSize = 'small' | 'normal' | 'large';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetAccessibility: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [highContrast, setHighContrastState] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('gov-font-size') as FontSize;
    const savedContrast = localStorage.getItem('gov-high-contrast') === 'true';
    
    if (savedFontSize) setFontSizeState(savedFontSize);
    if (savedContrast) setHighContrastState(savedContrast);
    
    setIsInitialized(true);
  }, []);

  // Apply changes to HTML element
  useEffect(() => {
    if (!isInitialized) return;

    const html = document.documentElement;
    html.setAttribute('data-font-size', fontSize);
    html.setAttribute('data-high-contrast', highContrast.toString());
    
    localStorage.setItem('gov-font-size', fontSize);
    localStorage.setItem('gov-high-contrast', highContrast.toString());
  }, [fontSize, highContrast, isInitialized]);

  const setFontSize = (size: FontSize) => setFontSizeState(size);
  const setHighContrast = (contrast: boolean) => setHighContrastState(contrast);

  const increaseFontSize = () => {
    if (fontSize === 'small') setFontSize('normal');
    else if (fontSize === 'normal') setFontSize('large');
  };

  const decreaseFontSize = () => {
    if (fontSize === 'large') setFontSize('normal');
    else if (fontSize === 'normal') setFontSize('small');
  };

  const resetAccessibility = () => {
    setFontSize('normal');
    setHighContrast(false);
  };

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      highContrast,
      setHighContrast,
      increaseFontSize,
      decreaseFontSize,
      resetAccessibility
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
