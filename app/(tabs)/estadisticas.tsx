import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function EstadisticasScreen() {
  const router = useRouter();
  const { peliculas } = useMovies();

  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const accent = useThemeColor({}, 'accent');
  const success = useThemeColor({}, 'success');
  const iconColor = useThemeColor({}, 'icon');

  const stats = useMemo(() => {
    const total = peliculas.length;
    const vistas = peliculas.filter((p) => p.vista).length;
    const pendientes = total - vistas;
    const favoritas = peliculas.filter((p) => p.favorita).length;
    const calificadas = peliculas.filter((p) => p.calificacion > 0);
    const promedio = calificadas.length
      ? calificadas.reduce((acc, p) => acc + p.calificacion, 0) / calificadas.length
      : 0;
    const mejor = [...peliculas].sort((a, b) => b.calificacion - a.calificacion)[0];

    const porGenero = new Map<string, number>();
    peliculas.forEach((p) => porGenero.set(p.genero, (porGenero.get(p.genero) ?? 0) + 1));
    const generos = Array.from(porGenero.entries()).sort((a, b) => b[1] - a[1]);
    const maxGenero = generos.length ? generos[0][1] : 1;

    return { total, vistas, pendientes, favoritas, promedio, mejor, generos, maxGenero };
  }, [peliculas]);

  const tiles: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { label: 'Total', value: String(stats.total), icon: 'film-outline' },
    { label: 'Vistas', value: String(stats.vistas), icon: 'checkmark-circle-outline' },
    { label: 'Pendientes', value: String(stats.pendientes), icon: 'time-outline' },
    { label: 'Favoritas', value: String(stats.favoritas), icon: 'heart-outline' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.header}>
          Estadísticas
        </ThemedText>
        <ThemedText type="caption" style={styles.subtitle}>
          Un vistazo a tu biblioteca de películas.
        </ThemedText>

        <View style={styles.grid}>
          {tiles.map((tile) => (
            <View key={tile.label} style={[styles.tile, { backgroundColor: cardBackground, borderColor }]}>
              <Ionicons name={tile.icon} size={20} color={accent} />
              <ThemedText type="title" style={styles.tileValue}>
                {tile.value}
              </ThemedText>
              <ThemedText type="caption">{tile.label}</ThemedText>
            </View>
          ))}
        </View>

        <View style={[styles.promedioCard, { backgroundColor: cardBackground, borderColor }]}>
          <View>
            <ThemedText type="caption">Calificación promedio</ThemedText>
            <ThemedText type="title" style={styles.promedioValor}>
              {stats.promedio > 0 ? stats.promedio.toFixed(1) : '—'}
              <ThemedText type="caption"> / 10</ThemedText>
            </ThemedText>
          </View>
          <Ionicons name="star" size={32} color={accent} />
        </View>

        {stats.mejor && (
          <Pressable
            style={[styles.destacada, { backgroundColor: cardBackground, borderColor }]}
            onPress={() => router.push(`/pelicula/${stats.mejor.id}`)}>
            <Image source={{ uri: stats.mejor.poster }} style={styles.destacadaPoster} contentFit="cover" />
            <View style={styles.destacadaInfo}>
              <ThemedText type="caption">Mejor valorada</ThemedText>
              <ThemedText type="defaultSemiBold" numberOfLines={2}>
                {stats.mejor.titulo}
              </ThemedText>
              <View style={styles.destacadaRating}>
                <Ionicons name="star" size={14} color={accent} />
                <ThemedText style={{ color: accent, fontWeight: '700' }}>
                  {stats.mejor.calificacion.toFixed(1)}
                </ThemedText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={iconColor} />
          </Pressable>
        )}

        <ThemedText type="subtitle" style={styles.seccion}>
          Distribución por género
        </ThemedText>
        <View style={[styles.generoCard, { backgroundColor: cardBackground, borderColor }]}>
          {stats.generos.map(([genero, cantidad]) => (
            <View key={genero} style={styles.generoRow}>
              <ThemedText style={styles.generoLabel} numberOfLines={1}>
                {genero}
              </ThemedText>
              <View style={styles.generoBarTrack}>
                <View
                  style={[
                    styles.generoBarFill,
                    { width: `${(cantidad / stats.maxGenero) * 100}%`, backgroundColor: success },
                  ]}
                />
              </View>
              <ThemedText type="caption" style={styles.generoCantidad}>
                {cantidad}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  header: { marginBottom: 4 },
  subtitle: { marginBottom: Spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.md },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: 6,
  },
  tileValue: { fontSize: 28, lineHeight: 32 },
  promedioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  promedioValor: { fontSize: 28 },
  destacada: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  destacadaPoster: { width: 52, height: 76, borderRadius: Radius.sm },
  destacadaInfo: { flex: 1, gap: 4 },
  destacadaRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seccion: { marginBottom: Spacing.md },
  generoCard: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.md },
  generoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  generoLabel: { width: 110, fontSize: 13 },
  generoBarTrack: { flex: 1, height: 8, borderRadius: Radius.full, backgroundColor: 'rgba(155,163,172,0.2)' },
  generoBarFill: { height: 8, borderRadius: Radius.full },
  generoCantidad: { width: 20, textAlign: 'right' },
});
