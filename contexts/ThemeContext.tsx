import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

const STORAGE_KEY = 'miprimerproyecto:temaPreferencia';

export type TemaPreferencia = 'system' | 'light' | 'dark';

interface ThemeContextType {
  preferencia: TemaPreferencia;
  colorScheme: 'light' | 'dark';
  setPreferencia: (p: TemaPreferencia) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const sistema = useSystemColorScheme();
  const [preferencia, setPreferenciaState] = useState<TemaPreferencia>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((guardada) => {
      if (guardada === 'light' || guardada === 'dark' || guardada === 'system') {
        setPreferenciaState(guardada);
      }
    });
  }, []);

  const setPreferencia = (p: TemaPreferencia) => {
    setPreferenciaState(p);
    AsyncStorage.setItem(STORAGE_KEY, p);
  };

  const colorScheme = preferencia === 'system' ? sistema ?? 'light' : preferencia;

  return (
    <ThemeContext.Provider value={{ preferencia, colorScheme, setPreferencia }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de un AppThemeProvider');
  }
  return context;
}
