import { FormBranding } from '../types/form';

export const defaultBranding: FormBranding = {
  primaryColor: '#1a365d',
  primaryContrast: '#ffffff',
  accentColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1a1a2e',
  textSecondaryColor: '#6b7280',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headingFontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  borderRadius: 8,
  logoPosition: 'top-left',
  showPoweredBy: true,
  poweredByText: 'Powered by FormFlow',
};

export function brandingToCSSVars(branding: FormBranding): Record<string, string> {
  return {
    '--ff-primary': branding.primaryColor,
    '--ff-primary-contrast': branding.primaryContrast || '#ffffff',
    '--ff-accent': branding.accentColor || branding.primaryColor,
    '--ff-bg': branding.backgroundColor,
    '--ff-text': branding.textColor,
    '--ff-text-secondary': branding.textSecondaryColor || '#6b7280',
    '--ff-font-family': branding.fontFamily || defaultBranding.fontFamily!,
    '--ff-font-heading': branding.headingFontFamily || branding.fontFamily || defaultBranding.fontFamily!,
    '--ff-border-radius': `${branding.borderRadius ?? 8}px`,
  };
}
