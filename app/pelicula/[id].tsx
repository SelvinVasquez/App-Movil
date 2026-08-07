import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function DetallePelicula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { peliculas } = useMovies();
  const pelicula = peliculas.find((p) => p.id === id);
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  if (!pelicula) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No se encontró la película.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.posterWrapper}>
        <Image source={{ uri: pelicula.poster }} style={styles.poster} contentFit="cover" />
        <View style={styles.badgeOverlay}>
          <RatingBadge calificacion={pelicula.calificacion} size="large" />
        </View>
      </View>

      <View style={styles.content}>
        <ThemedText type="title">{pelicula.titulo}</ThemedText>

        <View style={styles.metaRow}>
          <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText style={styles.chipText}>{pelicula.año}</ThemedText>
          </View>
          <View style={[styles.chip, { backgroundColor: cardBackground, borderColor }]}>
            <ThemedText style={styles.chipText}>{pelicula.genero}</ThemedText>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: borderColor }]} />

        <ThemedText type="subtitle">Calificación</ThemedText>
        <ThemedText style={styles.calificacionTexto}>
          {pelicula.calificacion > 0
            ? `⭐ ${pelicula.calificacion.toFixed(1)} / 10`
            : 'Aún sin calificar'}
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  scroll: { paddingBottom: 40 },
  posterWrapper: { position: 'relative' },
  poster: { width: '100%', height: 420 },
  badgeOverlay: { position: 'absolute', bottom: 16, right: 16 },
  content: { padding: 20, gap: 12 },
  metaRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '600' },
  divider: { height: 1, marginVertical: 8 },
  calificacionTexto: { fontSize: 16, opacity: 0.8 },
});
