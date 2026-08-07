import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { RatingBadge } from '@/components/rating-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const router = useRouter();
  const { peliculas } = useMovies();
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'icon');

  const renderItem = ({ item }: { item: Pelicula }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: cardBackground, borderColor },
        pressed && styles.cardPressed,
      ]}
      onPress={() => router.push(`/pelicula/${item.id}`)}>
      <View style={styles.posterWrapper}>
        <Image source={{ uri: item.poster }} style={styles.poster} contentFit="cover" />
        <View style={styles.badgeOverlay}>
          <RatingBadge calificacion={item.calificacion} />
        </View>
      </View>
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" numberOfLines={2}>
          {item.titulo}
        </ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={styles.metaText}>{item.año}</ThemedText>
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
          <ThemedText style={styles.metaText}>{item.genero}</ThemedText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={iconColor} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="title">Mis Favoritas 🎬</ThemedText>
          <ThemedText style={styles.subtitle}>
            {peliculas.length} {peliculas.length === 1 ? 'título' : 'títulos'} guardados
          </ThemedText>
        </View>
        <Link href="/modal" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={26} color="#fff" />
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={peliculas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  subtitle: { opacity: 0.6, marginTop: 2 },
  list: { paddingHorizontal: 20, paddingBottom: 24, gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardPressed: { opacity: 0.7 },
  posterWrapper: { position: 'relative' },
  poster: { width: 72, height: 104, borderRadius: 10 },
  badgeOverlay: { position: 'absolute', bottom: 6, left: 6 },
  info: { flex: 1, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { opacity: 0.6, fontSize: 14 },
  dot: { width: 3, height: 3, borderRadius: 1.5 },
  addButton: {
    backgroundColor: '#0a7ea4',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
