import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/services/api';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const danger = useThemeColor({}, 'danger');

  const enviar = async () => {
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      await iniciarSesion(email.trim(), password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.header}>
            Mi Biblioteca
          </ThemedText>
          <ThemedText type="caption" style={styles.subtitle}>
            Inicia sesión para ver tus películas
          </ThemedText>

          <TextInput
            style={[styles.input, { backgroundColor: cardBackground, borderColor, color: textColor }]}
            placeholder="Correo electrónico"
            placeholderTextColor={iconColor}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { backgroundColor: cardBackground, borderColor, color: textColor }]}
            placeholder="Contraseña"
            placeholderTextColor={iconColor}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <ThemedText style={[styles.error, { color: danger }]}>{error}</ThemedText>
          )}

          <Pressable
            style={[styles.boton, { backgroundColor: accent }, cargando && styles.botonDeshabilitado]}
            onPress={enviar}
            disabled={cargando}>
            {cargando ? (
              <ActivityIndicator color="#151718" />
            ) : (
              <ThemedText style={styles.botonTexto}>Iniciar sesión</ThemedText>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  header: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: Spacing.lg },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  error: { textAlign: 'center' },
  boton: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  botonDeshabilitado: { opacity: 0.7 },
  botonTexto: { color: '#151718', fontWeight: '700', fontSize: 16 },
});
