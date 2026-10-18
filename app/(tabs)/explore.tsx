import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Chip } from '@/components/chip';
import { ChipsRow } from '@/components/chips-row';
import { MovieCard } from '@/components/movie-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';

type Orden = 'relevancia' | 'titulo' | 'año' | 'calificacion';

const ORDENES: { key: Orden; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'relevancia', label: 'Relevancia', icon: 'sparkles-outline' },
  { key: 'titulo', label: 'Título A-Z', icon: 'text-outline' },
  { key: 'año', label: 'Más recientes', icon: 'calendar-outline' },
  { key: 'calificacion', label: 'Mejor valoradas', icon: 'star-outline' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { peliculas, toggleFavorita } = useMovies();
  const [busqueda, setBusqueda] = useState('');
  const [generoActivo, setGeneroActivo] = useState<string | null>(null);
  const [orden, setOrden] = useState<Orden>('relevancia');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  const cardBackground = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const generos = useMemo(
    () => Array.from(new Set(peliculas.map((p) => p.genero))).sort(),
    [peliculas]
  );

  const resultados = useMemo(() => {
    let datos = peliculas.filter((p) => p.titulo.toLowerCase().includes(busqueda.toLowerCase()));

    if (generoActivo) {
      datos = datos.filter((p) => p.genero === generoActivo);
    }

    const ordenado = [...datos];
    switch (orden) {
      case 'titulo':
        ordenado.sort((a, b) => a.titulo.localeCompare(b.titulo));
        break;
      case 'año':
        ordenado.sort((a, b) => b.año - a.año);
        break;
      case 'calificacion':
        ordenado.sort((a, b) => b.calificacion - a.calificacion);
        break;
      default:
        break;
    }
    return ordenado;
  }, [peliculas, busqueda, generoActivo, orden]);

  const renderItem = ({ item }: { item: Pelicula }) => (
    <MovieCard
      pelicula={item}
      onPress={() => router.push(`/pelicula/${item.id}`)}
      onToggleFavorita={() => toggleFavorita(item.id)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Explorar
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

      <ChipsRow>
        <Chip label="Todos los géneros" active={!generoActivo} onPress={() => setGeneroActivo(null)} />
        {generos.map((genero) => (
          <Chip
            key={genero}
            label={genero}
            active={generoActivo === genero}
            onPress={() => setGeneroActivo(generoActivo === genero ? null : genero)}
          />
        ))}
      </ChipsRow>

      <ChipsRow>
        {ORDENES.map((item) => (
          <Chip
            key={item.key}
            label={item.label}
            icon={item.icon}
            active={orden === item.key}
            onPress={() => setOrden(item.key)}
          />
        ))}
      </ChipsRow>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacioWrapper}>
            <Ionicons name="film-outline" size={40} color={iconColor} />
            <ThemedText type="caption">No se encontraron películas.</ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  header: { paddingHorizontal: Spacing.xl, marginBottom: Spacing.lg },
  buscadorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  buscador: { flex: 1, fontSize: 16 },
  list: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.sm, paddingBottom: 24, gap: Spacing.md },
  vacioWrapper: { alignItems: 'center', marginTop: 60, gap: 10 },
});
