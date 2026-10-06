import { Platform } from 'react-native';

export const colors = {
  bg: '#eceff6',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',
  border: '#e2e8f0',

  primary: '#4f46e5',
  primaryDark: '#4338ca',
  primarySoft: '#eef2ff',

  text: '#0f172a',
  textMuted: '#64748b',
  textFaint: '#94a3b8',

  danger: '#e11d48',
  dangerSoft: '#fff1f2',
  success: '#059669',

  overlay: 'rgba(15, 23, 42, 0.55)',
  white: '#ffffff',
};

// react-native-web deprecated the shadow* props in favour of boxShadow.
export function shadow(level = 1) {
  const presets = {
    1: { web: '0 1px 3px rgba(15,23,42,0.08)', radius: 4, offset: 2, opacity: 0.08, elevation: 2 },
    2: { web: '0 12px 32px rgba(15,23,42,0.16)', radius: 18, offset: 10, opacity: 0.18, elevation: 10 },
  };
  const p = presets[level] ?? presets[1];

  return Platform.select({
    web: { boxShadow: p.web },
    default: {
      elevation: p.elevation,
      shadowColor: '#0f172a',
      shadowOpacity: p.opacity,
      shadowRadius: p.radius,
      shadowOffset: { width: 0, height: p.offset },
    },
  });
}
