import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { useMovies } from '@/contexts/MoviesContext';

export default function HomeScreen() {
  const router = useRouter();
  const { peliculas } = useMovies();

  const renderItem = ({ item }: { item: Pelicula }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/pelicula/${item.id}`)}>
      <Image source={{ uri: item.poster }} style={styles.poster} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{item.titulo}</ThemedText>
        <ThemedText>{item.año} · {item.genero}</ThemedText>
        <ThemedText>⭐ {item.calificacion}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Mis Favoritas 🎬</ThemedText>
        <Link href="/modal" asChild>
          <Pressable style={styles.addButton}>
            <ThemedText style={styles.addButtonText}>+ Agregar</ThemedText>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  poster: { width: 70, height: 100, borderRadius: 8 },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  addButton: {
    backgroundColor: '#2f95dc',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});