import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { useMovies } from '@/contexts/MoviesContext';

export default function ExploreScreen() {
  const router = useRouter();
  const { peliculas } = useMovies();
  const [busqueda, setBusqueda] = useState('');

  const resultados = peliculas.filter((p) =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }: { item: Pelicula }) => (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/pelicula/${item.id}`)}>
      <Image source={{ uri: item.poster }} style={styles.poster} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{item.titulo}</ThemedText>
        <ThemedText>{item.año} · {item.genero}</ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>Buscar 🔎</ThemedText>

      <TextInput
        style={styles.buscador}
        placeholder="Buscar por título..."
        placeholderTextColor="#888"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <ThemedText style={styles.vacio}>No se encontraron películas.</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 16, marginBottom: 12 },
  buscador: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
  },
  list: { paddingHorizontal: 16, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(128,128,128,0.1)',
  },
  poster: { width: 60, height: 85, borderRadius: 8 },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  vacio: { textAlign: 'center', marginTop: 40, opacity: 0.6 },
});