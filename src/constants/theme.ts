import { Platform } from 'react-native';

export const Colors = {
  // Base background
  background: '#F8FAFC', 
  
  // Accents (Brighter & Cleaner)
  primary: '#6366F1', // Vibrant Indigo
  success: '#10B981', // Emerald Teal
  warning: '#F59E0B', // Amber
  error: '#EF4444',   // Red
  info: '#3B82F6',    // Bright Blue
  highlight: '#EC4899', // Pink

  // Text
  textPrimary: '#0F172A', // Rich Slate
  textSecondary: '#64748B', // Medium Slate
  textMuted: '#94A3B8', // Light Slate
  textWhite: '#FFFFFF',

  // Glass properties
  glassBackground: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(255, 255, 255, 1)',
};

export const Gradients = {
  // Brighter, cleaner backgrounds
  home: ['#F8FAFC', '#EFF6FF', '#F0FDF4'] as const,
  camera: ['#EFF6FF', '#FFFFFF', '#FFFFFF'] as const,
  review: ['#FFF7ED', '#F8FAFC', '#F8FAFC'] as const, 
  export: ['#F0FDF4', '#EFF6FF', '#FFFFFF'] as const, 
  success: ['#ECFDF5', '#F0FDF4', '#FFFFFF'] as const, 
  splash: ['#FFFFFF', '#EEF2FF', '#E0E7FF'] as const, // Indigo tint for splash
};

export const Typography = {
  // Unified Plus Jakarta Sans
  display: 'PlusJakartaSans_700Bold',
  body: 'PlusJakartaSans_400Regular',
  mono: 'JetBrainsMono_500Medium',
  labels: 'PlusJakartaSans_500Medium',
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  five: 32,
  six: 48,
  seven: 64,
};

export const Radius = {
  sm: 12,
  md: 14,
  lg: 20,
  full: 999,
};

export const Shadows = {
  glass: {
    shadowColor: '#94A3B8',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    elevation: 4,
  },
  button: {
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  tabBar: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  }
};

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
