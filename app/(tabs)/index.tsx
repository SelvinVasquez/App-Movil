import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { MovieCard } from '@/components/movie-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

type Filtro = 'todas' | 'favoritas' | 'pendientes' | 'vistas';

const FILTROS: { key: Filtro; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'todas', label: 'Todas', icon: 'apps' },
  { key: 'favoritas', label: 'Favoritas', icon: 'heart' },
  { key: 'pendientes', label: 'Pendientes', icon: 'time-outline' },
  { key: 'vistas', label: 'Vistas', icon: 'checkmark-circle' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { peliculas, toggleFavorita } = useMovies();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const accent = useThemeColor({}, 'accent');
  const iconColor = useThemeColor({}, 'icon');

  const lista = useMemo(() => {
    switch (filtro) {
      case 'favoritas':
        return peliculas.filter((p) => p.favorita);
      case 'pendientes':
        return peliculas.filter((p) => !p.vista);
      case 'vistas':
        return peliculas.filter((p) => p.vista);
      default:
        return peliculas;
    }
  }, [peliculas, filtro]);

  const renderItem = ({ item }: { item: Pelicula }) => (
    <MovieCard
      pelicula={item}
      onPress={() => router.push(`/pelicula/${item.id}`)}
      onToggleFavorita={() => toggleFavorita(item.id)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <ThemedText type="title">Mi Biblioteca</ThemedText>
          <ThemedText type="caption" style={styles.subtitle}>
            {peliculas.length} {peliculas.length === 1 ? 'título' : 'títulos'} guardados
          </ThemedText>
        </View>
        <Link href="/modal" asChild>
          <Pressable style={StyleSheet.flatten([styles.addButton, { backgroundColor: accent }])}>
            <Ionicons name="add" size={26} color="#151718" />
          </Pressable>
        </Link>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTROS}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.filtros}
        renderItem={({ item }) => (
          <Chip
            label={item.label}
            icon={item.icon}
            active={filtro === item.key}
            onPress={() => setFiltro(item.key)}
          />
        )}
      />

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacioWrapper}>
            <Ionicons name="film-outline" size={40} color={iconColor} />
            <ThemedText type="caption">No hay películas en esta categoría.</ThemedText>
          </View>
        }
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
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  subtitle: { marginTop: 2 },
  filtros: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.lg },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 24, gap: Spacing.md },
  vacioWrapper: { alignItems: 'center', marginTop: 60, gap: 10 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
