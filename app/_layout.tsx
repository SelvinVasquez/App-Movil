import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { AppThemeProvider, useAppTheme } from '@/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Navigation() {
  const { colorScheme } = useAppTheme();
  const { token, cargando } = useAuth();

  if (cargando) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MoviesProvider>
        <Stack>
          <Stack.Protected guard={!!token}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modal"
              options={{ presentation: 'modal', title: 'Agregar película' }}
            />
            <Stack.Screen
              name="editar/[id]"
              options={{ presentation: 'modal', title: 'Editar película' }}
            />
            <Stack.Screen name="pelicula/[id]" options={{ title: 'Detalle' }} />
          </Stack.Protected>
          <Stack.Protected guard={!token}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </MoviesProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Navigation />
      </AppThemeProvider>
    </AuthProvider>
  );
}
