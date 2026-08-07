import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ExploreScreen() {
  const router = useRouter();
  const { peliculas } = useMovies();
  const [busqueda, setBusqueda] = useState('');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const resultados = peliculas.filter((p) =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderItem = ({ item }: { item: Pelicula }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBackground, borderColor },
        pressed && styles.cardPressed,
      ]}
      onPress={() => router.push(`/pelicula/${item.id}`)}>
      <Image source={{ uri: item.poster }} style={styles.poster} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={2}>
          {item.titulo}
        </ThemedText>
        <ThemedText style={styles.metaText}>
          {item.año} · {item.genero}
        </ThemedText>
      </View>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Buscar 🔎
      </ThemedText>

      <View style={[styles.buscadorWrapper, { backgroundColor: cardBackground, borderColor }]}>
        <Ionicons name="search" size={18} color={iconColor} />
        <TextInput
          style={[styles.buscador, { color: textColor }]}
          placeholder="Buscar por título..."
          placeholderTextColor={iconColor}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={iconColor} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacioWrapper}>
            <Ionicons name="film-outline" size={40} color={iconColor} />
            <ThemedText style={styles.vacio}>No se encontraron películas.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: 20, marginBottom: 16 },
  buscadorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buscador: { flex: 1, fontSize: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardPressed: { opacity: 0.7 },
  poster: { width: 64, height: 92, borderRadius: 10 },
  info: { flex: 1, justifyContent: 'center', gap: 6 },
  metaText: { opacity: 0.6, fontSize: 14 },
  vacioWrapper: { alignItems: 'center', marginTop: 60, gap: 10 },
  vacio: { opacity: 0.6 },
});
