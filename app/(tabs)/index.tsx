import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/animated-pressable';

import { Chip } from '@/components/chip';
import { MovieCard } from '@/components/movie-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { Pelicula } from '@/constants/movies';
import { Radius, Spacing } from '@/constants/theme';
import { useMovies } from '@/contexts/MoviesContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { aviso } from '@/services/avisos';

type Filtro = 'todas' | 'favoritas' | 'pendientes' | 'vistas';

const FILTROS: { key: Filtro; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'todas', label: 'Todas', icon: 'apps' },
  { key: 'favoritas', label: 'Favoritas', icon: 'heart' },
  { key: 'pendientes', label: 'Pendientes', icon: 'time-outline' },
  { key: 'vistas', label: 'Vistas', icon: 'checkmark-circle' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { peliculas, cargando, error, recargar, toggleFavorita } = useMovies();
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const accent = useThemeColor({}, 'accent');
  const iconColor = useThemeColor({}, 'icon');

  const manejarToggleFavorita = (id: string) => {
    toggleFavorita(id).catch(() => aviso('Error', 'No se pudo actualizar la película.'));
  };

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

  const renderItem = ({ item, index }: { item: Pelicula; index: number }) => (
    <MovieCard
      index={index}
      pelicula={item}
      onPress={() => router.push(`/pelicula/${item.id}`)}
      onToggleFavorita={() => manejarToggleFavorita(item.id)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500)} style={styles.headerRow}>
        <View>
          <ThemedText type="title">Mi Biblioteca</ThemedText>
          <ThemedText type="caption" style={styles.subtitle}>
            {peliculas.length} {peliculas.length === 1 ? 'título' : 'títulos'} guardados
          </ThemedText>
        </View>
        <AnimatedPressable
          haptic
          accessibilityLabel="Agregar película"
          onPress={() => router.push('/modal')}
          style={[styles.addButton, { backgroundColor: accent }]}>
          <Ionicons name="add" size={26} color="#151718" />
        </AnimatedPressable>
      </Animated.View>

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

      {cargando && peliculas.length === 0 ? (
        <View style={styles.vacioWrapper}>
          <ActivityIndicator color={accent} size="large" />
          <ThemedText type="caption">Cargando tu biblioteca...</ThemedText>
        </View>
      ) : error ? (
        <View style={styles.vacioWrapper}>
          <Ionicons name="cloud-offline-outline" size={40} color={iconColor} />
          <ThemedText type="caption" style={{ textAlign: 'center', paddingHorizontal: Spacing.xl }}>
            {error}
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={cargando} onRefresh={recargar} tintColor={accent} />}
          ListEmptyComponent={
            <Animated.View entering={FadeIn.duration(400)} style={styles.vacioWrapper}>
              <Ionicons name="film-outline" size={40} color={iconColor} />
              <ThemedText type="caption">No hay películas en esta categoría.</ThemedText>
            </Animated.View>
          }
        />
      )}
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
  // En nativo, una FlatList horizontal se estira en vertical dentro de un contenedor flex; flexGrow 0 la limita a su contenido.
  filtrosLista: { flexGrow: 0, flexShrink: 0 },
  filtros: { paddingHorizontal: Spacing.xl, gap: Spacing.sm, paddingBottom: Spacing.lg },
  // La lista ocupa el resto de la pantalla y arranca arriba, sin centrar el contenido.
  listaVertical: { flex: 1, alignSelf: 'stretch' },
  list: { justifyContent: 'flex-start', paddingHorizontal: Spacing.xl, paddingBottom: 24, gap: Spacing.md },
  vacioWrapper: { alignItems: 'center', alignSelf: 'stretch', marginTop: 60, gap: 10 },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
