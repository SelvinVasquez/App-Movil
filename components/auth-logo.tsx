import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

/** Cabecera de las pantallas de acceso: insignia dorada con ícono, título y subtítulo. */
export function AuthLogo({ titulo, subtitulo }: { titulo: string; subtitulo: string }) {
  const accent = useThemeColor({}, 'accent');

  return (
    <View style={styles.contenedor}>
      <LinearGradient
        colors={[accent, '#B8860B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.insignia}>
        <Ionicons name="film" size={34} color="#151718" />
      </LinearGradient>
      <ThemedText type="title" style={styles.texto}>
        {titulo}
      </ThemedText>
      <ThemedText type="caption" style={styles.texto}>
        {subtitulo}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xxl },
  insignia: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  texto: { textAlign: 'center' },
});
