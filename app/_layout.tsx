import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { MoviesProvider } from '@/contexts/MoviesContext';
import { AppThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Colors } from '@/constants/theme';

/** Ancho máximo del contenido en la web: evita que la app se estire en pantallas grandes. */
const ANCHO_MAXIMO_WEB = 640;

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
      <View style={[estilos.fondo, { backgroundColor: Colors[colorScheme].surface }]}>
      <View
        style={[
          estilos.columna,
          { backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].border },
        ]}>
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
      </View>
      </View>
    </ThemeProvider>
  );
}

const estilos = StyleSheet.create({
  fondo: { flex: 1, alignItems: 'center' },
  columna: {
    flex: 1,
    width: '100%',
    ...(Platform.OS === 'web' ? { maxWidth: ANCHO_MAXIMO_WEB, borderLeftWidth: 1, borderRightWidth: 1 } : null),
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Navigation />
      </AppThemeProvider>
    </AuthProvider>
  );
}
