import { useAppTheme } from '@/contexts/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  return useAppTheme().colorScheme;
}
