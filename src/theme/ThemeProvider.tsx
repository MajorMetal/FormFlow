import React, { createContext, useContext, useMemo, useEffect } from 'react';
import { FormBranding } from '../types/form';
import { defaultBranding, brandingToCSSVars } from './defaultTheme';

interface ThemeContextValue {
  branding: FormBranding;
}

const ThemeContext = createContext<ThemeContextValue>({
  branding: defaultBranding,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  branding?: Partial<FormBranding>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ branding, children }) => {
  const merged = useMemo<FormBranding>(
    () => ({ ...defaultBranding, ...branding }),
    [branding]
  );

  const cssVars = useMemo(() => brandingToCSSVars(merged), [merged]);

  // Load Google Fonts if custom fonts specified
  useEffect(() => {
    const fonts: string[] = [];
    if (merged.fontFamily && !merged.fontFamily.includes('-apple-system')) {
      const fontName = merged.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      fonts.push(fontName);
    }
    if (merged.headingFontFamily && merged.headingFontFamily !== merged.fontFamily) {
      const fontName = merged.headingFontFamily.split(',')[0].replace(/['"]/g, '').trim();
      fonts.push(fontName);
    }

    if (fonts.length > 0) {
      const families = fonts.map(f => f.replace(/ /g, '+')).join('&family=');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${families}:wght@300;400;500;600;700&display=swap`;
      document.head.appendChild(link);
      return () => { document.head.removeChild(link); };
    }
  }, [merged.fontFamily, merged.headingFontFamily]);

  const value = useMemo(() => ({ branding: merged }), [merged]);

  return (
    <ThemeContext.Provider value={value}>
      <div className="formflow-root" style={cssVars as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
