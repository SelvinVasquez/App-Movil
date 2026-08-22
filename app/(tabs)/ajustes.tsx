import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { TemaPreferencia, useAppTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';

const OPCIONES_TEMA: { key: TemaPreferencia; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'system', label: 'Sistema', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Claro', icon: 'sunny-outline' },
  { key: 'dark', label: 'Oscuro', icon: 'moon-outline' },
];

export default function AjustesScreen() {
  const { preferencia, setPreferencia } = useAppTheme();
  const { cerrarSesion } = useAuth();
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const danger = useThemeColor({}, 'danger');
  const accent = useThemeColor({}, 'accent');

  const confirmarCerrarSesion = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: cerrarSesion },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.header}>
          Ajustes
        </ThemedText>

        <ThemedText type="subtitle" style={styles.seccion}>
          Apariencia
        </ThemedText>
        <View style={styles.temaRow}>
          {OPCIONES_TEMA.map((opcion) => (
            <Chip
              key={opcion.key}
              label={opcion.label}
              icon={opcion.icon}
              active={preferencia === opcion.key}
              onPress={() => setPreferencia(opcion.key)}
            />
          ))}
        </View>

        <ThemedText type="subtitle" style={styles.seccion}>
          Cuenta
        </ThemedText>
        <Pressable
          style={[styles.fila, { backgroundColor: cardBackground, borderColor }]}
          onPress={confirmarCerrarSesion}>
          <View style={styles.filaTexto}>
            <Ionicons name="log-out-outline" size={20} color={danger} />
            <View>
              <ThemedText type="defaultSemiBold">Cerrar sesión</ThemedText>
              <ThemedText type="caption">Borra el token guardado en este dispositivo</ThemedText>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={danger} />
        </Pressable>

        <ThemedText type="subtitle" style={styles.seccion}>
          Acerca de
        </ThemedText>
        <View style={[styles.fila, { backgroundColor: cardBackground, borderColor }]}>
          <View style={styles.filaTexto}>
            <Ionicons name="film" size={20} color={accent} />
            <View>
              <ThemedText type="defaultSemiBold">
                {Constants.expoConfig?.name ?? 'Mi Biblioteca'}
              </ThemedText>
              <ThemedText type="caption">Versión {Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.avisoCard, { backgroundColor: cardBackground, borderColor }]}>
          <Ionicons name="cloud-done-outline" size={20} color={accent} />
          <ThemedText type="caption" style={styles.avisoTexto}>
            La pestaña &ldquo;Descubrir&rdquo; trae películas de la API pública de Studio Ghibli.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  header: { marginBottom: Spacing.xl },
  seccion: { marginBottom: Spacing.md, marginTop: Spacing.sm },
  temaRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, flexWrap: 'wrap' },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filaTexto: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flexShrink: 1 },
  avisoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  avisoTexto: { flex: 1 },
});
