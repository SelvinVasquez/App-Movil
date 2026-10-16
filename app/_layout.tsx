import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { AppThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Navigation() {
  const { colorScheme } = useAppTheme();
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <MoviesProvider>
        <ToastProvider>
        <Stack>
          <Stack.Protected guard={!!usuario}>
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
            <Stack.Screen
              name="integracion/[tipo]"
              options={{ presentation: 'modal', title: 'Registrar' }}
            />
          </Stack.Protected>
          <Stack.Protected guard={!usuario}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="registro" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </ToastProvider>
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
