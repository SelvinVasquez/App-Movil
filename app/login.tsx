import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AuthField } from '@/components/auth-field';
import { AuthLogo } from '@/components/auth-logo';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError } from '@/services/api';

export default function LoginScreen() {
  const { iniciarSesion } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accent = useThemeColor({}, 'accent');
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
          <AuthLogo titulo="Mi Biblioteca" subtitulo="Inicia sesión para ver tus películas" />

          <AuthField
            icono="mail-outline"
            placeholder="Correo electrónico"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <AuthField
            icono="lock-closed-outline"
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            value={password}
            onChangeText={setPassword}
          />

          {error && <ThemedText style={[styles.error, { color: danger }]}>{error}</ThemedText>}

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

          <Link href="/registro" asChild>
            <Pressable style={styles.registroLink}>
              <ThemedText type="caption">
                ¿No tienes cuenta? <ThemedText style={{ color: accent }}>Regístrate</ThemedText>
              </ThemedText>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, gap: Spacing.md },
  error: { textAlign: 'center' },
  boton: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  botonDeshabilitado: { opacity: 0.7 },
  botonTexto: { color: '#151718', fontWeight: '700', fontSize: 16 },
  registroLink: { alignItems: 'center', marginTop: Spacing.md },
});
