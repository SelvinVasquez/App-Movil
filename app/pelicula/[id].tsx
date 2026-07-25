import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useMovies } from '@/contexts/MoviesContext';

export default function DetallePelicula() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { peliculas } = useMovies();
  const pelicula = peliculas.find((p) => p.id === id);

  if (!pelicula) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No se encontró la película.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pelicula.poster }} style={styles.poster} contentFit="cover" />
      <ThemedText type="title">{pelicula.titulo}</ThemedText>
      <ThemedText type="subtitle">{pelicula.año} · {pelicula.genero}</ThemedText>
      <ThemedText>⭐ Calificación: {pelicula.calificacion}</ThemedText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  poster: { width: '100%', height: 400, borderRadius: 12, marginBottom: 12 },
});