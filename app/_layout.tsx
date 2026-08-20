import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { MoviesProvider } from '@/contexts/MoviesContext';
import { AppThemeProvider, useAppTheme } from '@/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Navigation() {
  const { colorScheme } = useAppTheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MoviesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Agregar película' }} />
          <Stack.Screen
            name="editar/[id]"
            options={{ presentation: 'modal', title: 'Editar película' }}
          />
          <Stack.Screen name="pelicula/[id]" options={{ title: 'Detalle' }} />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </MoviesProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <Navigation />
    </AppThemeProvider>
  );
}
