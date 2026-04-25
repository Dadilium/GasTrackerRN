/**
 * Design tokens — centralised colors and spacing.
 */
export const colors = {
  primary: '#2563EB',
  primaryLight: '#DBEAFE',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textOnPrimary: '#FFFFFF',
  success: '#16A34A',
  successBg: '#DCFCE7',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  border: '#E2E8F0',
  highlight: '#FEF9C3',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;
