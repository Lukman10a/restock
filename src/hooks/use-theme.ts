import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useTheme() {
  const scheme = useColorScheme();

  return {
    colorScheme: scheme,
    background: Colors.background,
    surface: Colors.surface,
    text: scheme === 'dark' ? Colors.textPrimary : Colors.textPrimary,
    border: Colors.border,
    primary: Colors.primary,
  };
}
